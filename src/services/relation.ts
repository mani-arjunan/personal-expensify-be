import { Knex } from "knex";
import { ApproveRelation, Relation } from "../types";
import { addRelationDb, approveRelationDb } from "../database/relation";
import { getUserWithUsername } from "../database/user";
import { PayloadError } from "../error-handler/custom-errors";

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

  await approveRelationDb(knex, approveRelation, {
    primary_id: primaryUser.id,
    association_id: associationUser.id,
  });
}
