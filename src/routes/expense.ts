import { NextFunction, Request, Response, Router } from "express";
import { Knex } from "knex";
import {
  validateAccessToken,
  validatePayload,
  validateToken,
} from "../validation/validate";
import { handleErrors } from "../error-handler";
import { addExpense } from "../services/expense";

export function expenseRoute(knex: Knex): Router {
  const router = Router();

  router.post(
    "/add-expense",
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
  );

  return router;
}
