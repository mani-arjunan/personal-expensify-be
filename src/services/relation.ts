import { Knex } from "knex";
import { ApproveRelation, Relation } from "../types";
import {
  addRelationDb,
  approveRelationDb,
  canApproveDb,
  getMyRealtionsDb,
  getPendingRelationsDb,
  getSentRelationsDb,
} from "../database/relation";
import { getUserWithUsername } from "../database/user";
import { AuthError, PayloadError } from "../error-handler/custom-errors";

export async function addRelation(knex: Knex, relation: Relation) {
  const primaryUser = await getUserWithUsername(knex, relation.primaryUsername);
  const associationUser = await getUserWithUsername(
    knex,
    relation.associatedUsername,
  );

  if (!associationUser) {
    throw new PayloadError(
      `Associated Username is not found ${relation.associatedUsername}`,
    );
  }
  await addRelationDb(knex, relation, {
    primary_id: primaryUser.id,
    association_id: associationUser.id,
  });
}

export async function getMyRelations(knex: Knex, username: string) {
  const user = await getUserWithUsername(knex, username);

  if (!user) {
    throw new AuthError(`username is not found ${username}`);
  }

  return await getMyRealtionsDb(knex, user.id);
}

export async function getSentRelations(knex: Knex, username: string) {
  const user = await getUserWithUsername(knex, username);

  if (!user) {
    throw new AuthError(`username is not found ${username}`);
  }

  return await getSentRelationsDb(knex, user.id);
}

export async function getPendingRelations(knex: Knex, username: string) {
  const user = await getUserWithUsername(knex, username);

  if (!user) {
    throw new AuthError(`username is not found ${username}`);
  }

  return await getPendingRelationsDb(knex, user.id);
}

export async function approveRelation(
  knex: Knex,
  approveRelation: ApproveRelation,
) {
  const primaryUser = await getUserWithUsername(
    knex,
    approveRelation.primaryUsername,
  );
  const associationUser = await getUserWithUsername(
    knex,
    approveRelation.associatedUsername,
  );

  if (!associationUser) {
    throw new PayloadError(
      `Associated Username is not found ${approveRelation.associatedUsername}`,
    );
  }
  const canApprove = await canApproveDb(knex, {
    primary_id: primaryUser.id,
    association_id: associationUser.id,
  });

  if (canApprove.approved !== null || canApprove.rejected !== null) {
    throw new PayloadError(
      `This relation is already ${
        canApprove.approved ? "approved" : "rejected"
      }`,
    );
  }

  await approveRelationDb(knex, approveRelation, {
    primary_id: primaryUser.id,
    association_id: associationUser.id,
  });
}
