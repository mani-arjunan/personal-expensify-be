import { Router } from "express";
import { userRoute } from "./user";
import { tokenRoute } from "./token"
import { relationRoute } from "./relation";
import { DatabaseConnection } from "../connection";

export function routes(): Router {
  const router = Router();
  const database = DatabaseConnection.knex;

  router.use("/users", userRoute(database));
  router.use("/get-access-token", tokenRoute(database))
  router.use("/relation", relationRoute(database));

  return router;
}
