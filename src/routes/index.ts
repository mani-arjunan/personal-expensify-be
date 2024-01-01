import { Router } from "express";
import { userRoute } from "./user";
import { tokenRoute } from "./token"
import { DatabaseConnection } from "../connection";

export function routes(): Router {
  const router = Router();
  const database = DatabaseConnection.knex;

  router.use("/users", userRoute(database));
  router.use("/get-access-token", tokenRoute(database))


  return router;
}
