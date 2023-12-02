import { Request, Response, Router } from "express";
import { Knex } from "knex";
import { validateAccessToken } from "../validation/validate";

export function userRoute(knex: Knex): Router {
  const router = Router();

  router.get("/", validateAccessToken, async (req: Request, res: Response) => {
    console.log("You are in Users get route");
    const data = await knex.raw(`
      SELECT * FROM users
    `);
    console.log(data.rows)
    res.send("Welcome to Users Route!");
  });

  return router;
}
