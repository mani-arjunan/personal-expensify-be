import { Knex } from "knex";
import { Router, Request, Response } from "express";

import { handleErrors } from "../error-handler";
import { validateRefreshToken, validateToken } from "../validation/validate";
import { createAccessToken } from "../services/token";

export function tokenRoute(knex: Knex): Router {
  const router = Router();

  router.get(
    "/",
    (req, res, next) => validateRefreshToken(req, res, next, knex),
    async (req: Request, res: Response) => {
      const token = (req.headers.authorization as string).split(" ")[1];

      handleErrors(res, () => createAccessToken(knex, token), 200);
    },
  );

  return router;
}
