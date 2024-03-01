import { Router } from "express";
import { userRoute } from "./user";
import { tokenRoute } from "./token";
import { relationRoute } from "./relation";
import { incomeRoute } from "./income";
import { expenseRoute } from "./expense";
import { DatabaseConnection } from "../connection";
import { methodNotAllowed } from "../helpers";

export function routes(): Router {
  const router = Router();
  const database = DatabaseConnection.knex;

  router.use("/users", userRoute(database));
  router.use("/get-access-token", tokenRoute(database));
  router.use("/relation", relationRoute(database));
  router.use("/income", incomeRoute(database));
  router.use("/expense", expenseRoute(database));
  router.use("/", (_, res) => {
    res.send("Welcome to expense app");
  });
  router.use(methodNotAllowed);

  return router;
}
