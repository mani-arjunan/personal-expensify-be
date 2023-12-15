import { Request, Response, Router } from "express";
import { Knex } from "knex";
import { validateAccessToken } from "../validation/validate";

export function userRoute(knex: Knex): Router {
  const router = Router();

  router.get("/", validateAccessToken, async (req: Request, res: Response) => {
    console.log("You are in Users get route");
    const users = await knex.raw(`
      SELECT * FROM users
    `);
    res.status(200);
    res.send(users.rows)
  });

  return router;
}
