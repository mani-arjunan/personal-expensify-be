import { Request, Response, Router } from "express";
import { Knex } from "knex";
import {
  validateAccessToken,
  validatePayload,
  validateToken,
} from "../validation/validate";
import {
  logoutUser,
  getAllUsers,
  deleteUser,
  insertUser,
  loginUser,
  updateUser,
} from "../services/user";
import { User } from "../types";
import { handleErrors } from "../error-handler";

export function userRoute(knex: Knex): Router {
  const router = Router();

  router.put(
    "/update-user",
    (req, res, next) => validateToken(validateAccessToken, req, res, next),
    async (req: Request, res: Response) => {
      const userDetails = req.body

      await handleErrors(
        res,
        () => updateUser(knex, userDetails),
        200,
      );
    }
  )

  router.post(
    "/close-account",
    (req, res, next) => validateToken(validateAccessToken, req, res, next),
    (req, res, next) => validatePayload(req, res, next, "close-account"),
    async (req: Request, res: Response) => {
      const username = req.body.username as string

      await handleErrors(
        res,
        () =>
          deleteUser(
            knex,
            { username },
          ),
        200,
      );
    }
  )

  router.post(
    "/login",
    (req, res, next) => validatePayload(req, res, next, "login"),
    async (req: Request, res: Response) => {
      const user = req.body as User;
      await handleErrors(res, () => loginUser(knex, user), 200);
    },
  );

  router.get(
    "/logout",
    (req, res, next) => validateToken(validateAccessToken, req, res, next),
    async (req: Request, res: Response) => {
      await handleErrors(
        res,
        () =>
          logoutUser(
            knex,
            req.headers.userData as unknown as { username: string },
          ),
        200,
      );
    },
  );

  router.post(
    "/signup",
    (req, res, next) => validatePayload(req, res, next, "signup"),
    async (req: Request, res: Response) => {
      const user = req.body as User;
      await handleErrors(res, () => insertUser(knex, user), 201);
    },
  );

  router.get(
    "/",
    (req, res, next) => validateToken(validateAccessToken, req, res, next),
    async (req: Request, res: Response) => {
      await handleErrors(res, () => getAllUsers(knex), 200);
    },
  );

  return router;
}
