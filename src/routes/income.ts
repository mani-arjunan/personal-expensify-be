import { NextFunction, Request, Response, Router } from "express";
import { Knex } from "knex";
import {
  validateAccessToken,
  validatePayload,
  validateToken,
} from "../validation/validate";
import { handleErrors } from "../error-handler";
import { addIncome } from "../services/income";

export function incomeRoute(knex: Knex): Router {
  const router = Router();

  router.post(
    "/add-income",
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
  );

  return router;
}
