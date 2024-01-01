import { NextFunction, Request, Response } from "express";
import schema from "./schema/schema.json";
import jwt from "jsonwebtoken";
import { environment } from "../environment";
import { ValidateRoutes } from "../types";

export function validateToken(
  validator: (req: Request, res: Response, next: NextFunction) => void,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (environment.ENV !== "development") {
    validator(req, res, next);
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
      acc = {
        ...acc,
        [curr.key]: error.join(", "),
      };
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
  }
  next();
}

export function validateRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
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
      (err: unknown, data: unknown) => {
        if (err) {
          res.status(403);
          res.send("Invalid refresh token");
          return;
        } else {
          req.headers = {
            ...req.headers,
            userData: data as string,
          };
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
    return;
  } else {
    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      environment.ACCESS_TOKEN_SECRET,
      (err: unknown, data: unknown) => {
        if (err) {
          res.status(403);
          res.send("Invalid access token");
          return;
        } else {
          req.headers = {
            ...req.headers,
            userData: data as string,
          };
          next();
          return;
        }
      },
    );
  }
}

console.log(schema);
