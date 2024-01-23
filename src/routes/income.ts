import { NextFunction, Request, Response, Router } from "express";
import { Knex } from "knex";
import {
  validateAccessToken,
  validatePayload,
  validateQueryParams,
  validateToken,
} from "../validation/validate";
import { handleErrors } from "../error-handler";
import { addIncome, getIncome } from "../services/income";
import { methodNotAllowed } from "../helpers";

export function incomeRoute(knex: Knex): Router {
  const router = Router();

  router
    .route("/add-income")
    .post(
      (req: Request, res: Response, next: NextFunction) =>
        validateToken(validateAccessToken, req, res, next),
      (req, res, next) => validatePayload(req, res, next, "add-income"),
      async (req: Request, res: Response) => {
        const payload = {
          ...req.body,
          ...((res.locals.defaults && res.locals.defaults) || {}),
          username: (res.locals as unknown as Record<string, string>).username,
        };
        await handleErrors(res, () => addIncome(knex, payload), 201);
      },
    )
    .get(methodNotAllowed)
    .patch(methodNotAllowed)
    .delete(methodNotAllowed);

  router
    .route("/get-income")
    .get(
      (req: Request, res: Response, next: NextFunction) =>
        validateToken(validateAccessToken, req, res, next),
      (req, res, next) =>
        validateQueryParams(req.query, res, next, "get-income"),
      async (req: Request, res: Response) => {
        const data = await getIncome(knex, req.query);

        res.status(200);
        res.send(data);
      },
    )
    .post(methodNotAllowed)
    .patch(methodNotAllowed)
    .delete(methodNotAllowed);

  return router;
}
