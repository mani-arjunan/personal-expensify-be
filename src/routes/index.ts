import { Router } from "express";
import { userRoute } from "./user";
import { DatabaseConnection } from "../connection";

export function routes(): Router {
  const router = Router();
  const database = DatabaseConnection.knex;

  router.use("/users", userRoute(database));

  return router;
}
