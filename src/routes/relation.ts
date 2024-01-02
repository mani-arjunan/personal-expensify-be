import { Knex } from "knex";
import { Router, Request, Response, NextFunction } from "express";

import {
  validateAccessToken,
  validatePayload,
  validateToken,
} from "../validation/validate";
import { handleErrors } from "../error-handler";
import { addRelation, approveRelation } from "../services/relation";
import { ApproveRelation, Relation } from "../types";

export function relationRoute(knex: Knex): Router {
  const router = Router();

  router.post(
    "/add-relation",
    (req: Request, res: Response, next: NextFunction) =>
      validateToken(validateAccessToken, req, res, next),
    (req, res, next) => validatePayload(req, res, next, "add-relation"),
    async (req: Request, res: Response) => {
      const payload = {
        ...req.body,
        primaryUsername: (res.locals as unknown as Record<string, string>)
          .username,
      };
      await handleErrors(
        res,
        () => addRelation(knex, payload as Relation),
        200,
      );
    },
  );

  router.post(
    "/approve-relation",
    (req: Request, res: Response, next: NextFunction) =>
      validateToken(validateAccessToken, req, res, next),
    (req, res, next) => validatePayload(req, res, next, "approve-relation"),
    async (req: Request, res: Response) => {
      const payload = {
        ...req.body,
        associatedUsername: (res.locals as unknown as Record<string, string>)
          .username,
      };

      await handleErrors(
        res,
        () => approveRelation(knex, payload as ApproveRelation),
        200,
      );
    },
  );

  return router;
}
