import { Knex } from "knex";
import { Router, Request, Response, NextFunction } from "express";

import {
  validateAccessToken,
  validatePayload,
  validateToken,
} from "../validation/validate";
import { handleErrors } from "../error-handler";
import {
  addRelation,
  approveRelation,
  getPendingRelations,
  getSentRelations,
  getMyRelations
} from "../services/relation";
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
        ...((res.locals.defaults && res.locals.defaults) || {}),
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
        ...((res.locals.defaults && res.locals.defaults) || {}),
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

  router.get(
    "/relation-requests",
    (req: Request, res: Response, next: NextFunction) =>
      validateToken(validateAccessToken, req, res, next),
    async (req: Request, res: Response) => {
      const username = (res.locals as unknown as Record<string, string>)
        .username;
      await handleErrors(res, () => getPendingRelations(knex, username), 200);
    },
  );

  router.get(
    "/sent-relations",
    (req: Request, res: Response, next: NextFunction) =>
      validateToken(validateAccessToken, req, res, next),
    async (req: Request, res: Response) => {
      const username = (res.locals as unknown as Record<string, string>)
        .username;
      await handleErrors(res, () => getSentRelations(knex, username), 200);
    },
  );

  router.get(
    '/my-relations',
    (req: Request, res: Response, next: NextFunction) =>
      validateToken(validateAccessToken, req, res, next),
    async (req: Request, res: Response) => {
      const username = (res.locals as unknown as Record<string, string>)
        .username;
      await handleErrors(res, () => getMyRelations(knex, username), 200);
    },
  )

  return router;
}
