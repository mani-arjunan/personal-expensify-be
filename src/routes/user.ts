import { Request, Response, Router } from "express";
import { Knex } from "knex";
import {
  validateAccessToken,
  validatePayload,
  validateToken,
} from "../validation/validate";

export function userRoute(knex: Knex): Router {
  const router = Router();

  router.get(
    "/",
    (req, res, next) => validateToken(validateAccessToken, req, res, next),
    async (req: Request, res: Response) => {
      console.log("You are in Users get route");
      const users = await knex.raw(`
      SELECT * FROM users
    `);
      res.status(200);
      res.send(users.rows);
    },
  );

  router.post(
    "/signup",
    (req, res, next) => validateToken(validateAccessToken, req, res, next),
    (req, res, next) => validatePayload(req, res, next, "signup"),
    async (req: Request, res: Response) => {
      console.log("You are in Signup Route");
    },
  );
  return router;
}
