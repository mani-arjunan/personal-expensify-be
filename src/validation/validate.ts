import { NextFunction, Request, Response, query } from "express";
import schema from "./schema/schema.json";
import jwt from "jsonwebtoken";
import { environment } from "../environment";
import { ValidateRoutes, QueryParams } from "../types";
import { checkAndRemoveRefreshToken } from "../database/user";
import { Knex } from "knex";
import { getDateType } from "../helpers";

function getQueryParamsValidator(queryParams: Record<string, unknown>, type: QueryParams) {
  const date = queryParams['range-date'] || queryParams['range-month'] || queryParams['range-year'];

  const validateQueryParams = {
    'get-expense': {
      ...(date ? {
        date: {
          value: date,
          type: 'string',
          dateType: getDateType(queryParams)
        }
      } : {}),
    },
    'get-income': {
      ...(date ? { date: {
          value: date,
          type: 'string',
          dateType: getDateType(queryParams)
        }
      } : {}),
    }
  }

  return validateQueryParams[type]
}

export function validateToken(
  validator: (req: Request, res: Response, next: NextFunction) => void,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (environment.ENV !== "development") {
    validator(req, res, next);
    return;
  }

  next();
}

export function validatePayload(
  req: Request,
  res: Response,
  next: NextFunction,
  type: ValidateRoutes,
): void {
  const payload = req.body;
  const schemaToValidate = schema[type];
  const payloadKeys = Object.keys(payload);
  const missingKeys = schemaToValidate.requiredKeys.reduce(
    (acc: Array<string>, curr) => {
      if (!payloadKeys.includes(curr)) {
        acc.push(curr);
      }

      return acc;
    },
    [],
  );
  const defaultValues = {};

  const errors = schemaToValidate.properties.reduce((acc, curr) => {
    const currentProp: string = payload[curr.key];
    const error: string[] = [];

    if (currentProp) {
      if (typeof currentProp !== curr.type) {
        error.push(`should be of type of '${curr.type}'`);
      }

      if (curr.minLength && currentProp.length < curr.minLength) {
        error.push(`should be with minimum length ${curr.minLength}`);
      }

      if (curr.maxLength && currentProp.length > curr.maxLength) {
        error.push(`should be within the length of ${curr.maxLength}`);
      }

      if (
        curr.allowedValues.length > 0 &&
        !(curr.allowedValues as Array<string>).includes(currentProp)
      ) {
        error.push(
          `should contain only these values ${curr.allowedValues.join(", ")}`,
        );
      }

      if (curr.customRegex && !new RegExp(curr.customRegex).test(currentProp)) {
        error.push(`Invalid ${curr.key} format`);
      }

      if (error.length > 0) {
        acc = {
          ...acc,
          [curr.key]: error.join(", "),
        };
      }
    } else {
      if (curr.defaultValue !== null) {
        defaultValues[curr.key] = curr.defaultValue;
      }
    }
    return acc;
  }, {});

  const errorValues = Object.values(errors);
  if (errorValues.length > 0) {
    if (missingKeys.length > 0) {
      res.status(422);
      res.send({
        errors,
        requiredKeys: `Missing Required Keys: ${missingKeys.join(", ")}`,
      });
      return;
    }
    res.status(422);
    res.send(errors);
    return;
  }
  if (missingKeys.length > 0) {
    res.status(422);
    res.send({
      requiredKeys: `Missing Required Keys: ${missingKeys.join(", ")}`,
    });
    return;
  }
  if (Object.keys(defaultValues).length > 0) {
    res.locals = {
      ...res.locals,
      defaults: { ...defaultValues },
    };
  }
  next();
}

export function validateRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
  knex: Knex,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401);
    res.send("Token not present");
    return;
  } else {
    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      environment.REFRESH_TOKEN_SECRET,
      async (err: unknown, data: unknown) => {
        if (err) {
          res.status(403);
          res.send("Invalid refresh token");
          await checkAndRemoveRefreshToken(knex, token);
          return;
        } else {
          next();
          return;
        }
      },
    );
  }
}

export function validateAccessToken(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401);
    res.send("Token not present");
  } else {
    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      environment.ACCESS_TOKEN_SECRET,
      (err: unknown, data: unknown) => {
        if (err) {
          res.status(403);
          res.send("Invalid access token");
        } else {
          res.locals = {
            username: (data as Record<string, string>).username,
          };
          next();
        }
      },
    );
  }
}

export function validateQueryParams<T extends QueryParams>(
  queryParams: Record<string, unknown>,
  res: Response,
  next: NextFunction,
  typeOfQueryParam: T
): void {
  const fieldsToValidate = getQueryParamsValidator(queryParams, typeOfQueryParam)
  const fieldKeys = Object.keys(fieldsToValidate);
  const errors = {}

  for (let i = 0; i < fieldKeys.length; i++) {
    const [from, to] = fieldsToValidate[fieldKeys[i]].value.split('-');

    if (fieldKeys[i] === 'date') {
      if ((!from && !to) || !from || !to) {
        errors[fieldKeys[i]] = {
          ...errors[fieldKeys[i]],
          range: `Invalid range, supported format is dd/mm/yyyy or dd/mm/yy - dd/mm/yyyy or dd/mm/yy`
        }
      } else {
        const regex = {
          date: /^(3[01]|[12][0-9]|0?[1-9])(\/|-)(1[0-2]|0?[1-9])\2([0-9]{2})?[0-9]{4}$/,
          month: /^(0[1-9]|1[0-2])\/([0-9]{4})$/,
          year: /^([0-9]{4})$/
        }

        if (!regex[fieldsToValidate[fieldKeys[i]].dateType].test(from)) {
          errors[fieldKeys[i]] = {
            ...errors[fieldKeys[i]],
            from: `Invalid range "${from}" format, supported format is dd/mm/yyyy or dd/mm/yy`
          }
        }
        if (!regex[fieldsToValidate[fieldKeys[i]].dateType].test(to)) {
          errors[fieldKeys[i]] = {
            ...errors[fieldKeys[i]],
            to: `Invalid range "${to}" format, supported format is dd/mm/yyyy or dd/mm/yy`
          }
        }
      }
    }
  }

  const errorValues = Object.values(errors);
  if (errorValues.length > 0) {
    res.status(422);
    res.send({
      errors,
    });
    return;
  }

  next()
}
