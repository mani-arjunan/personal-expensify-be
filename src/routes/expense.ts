import { NextFunction, Request, Response, Router } from "express";
import { Knex } from "knex";
import {
  validateAccessToken,
  validatePayload,
  validateQueryParams,
  validateToken,
} from "../validation/validate";
import { handleErrors } from "../error-handler";
import { addExpense, getExpense } from "../services/expense";
import { methodNotAllowed } from "../helpers";

export function expenseRoute(knex: Knex): Router {
  const router = Router();

  router
    .route("/add-expense")
    .post(
      (req: Request, res: Response, next: NextFunction) =>
        validateToken(validateAccessToken, req, res, next),
      (req, res, next) => validatePayload(req, res, next, "add-expense"),
      async (req: Request, res: Response) => {
        const payload = {
          ...req.body,
          ...((res.locals.defaults && res.locals.defaults) || {}),
          username: (res.locals as unknown as Record<string, string>).username,
        };
        await handleErrors(res, () => addExpense(knex, payload), 201);
      },
    )
    .put(methodNotAllowed)
    .patch(methodNotAllowed)
    .delete(methodNotAllowed)
    .get(methodNotAllowed);

  router
    .route("/get-expense")
    .get(
      (req: Request, res: Response, next: NextFunction) =>
        validateToken(validateAccessToken, req, res, next),
      (req, res, next) =>
        validateQueryParams(req.query, res, next, "get-expense"),
      async (req: Request, res: Response) => {
        const data = await getExpense(knex, req.query);

        console.log(data)
        res.status(200);
        res.send(data);
      },
    )
    .put(methodNotAllowed)
    .patch(methodNotAllowed)
    .delete(methodNotAllowed)
    .post(methodNotAllowed);

  return router;
}
