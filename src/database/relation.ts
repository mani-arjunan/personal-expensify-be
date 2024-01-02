import { Knex } from "knex";
import { ApproveRelation, Relation } from "../types";
import { UniqueError } from "../error-handler/custom-errors";

export async function approveRelationDb(
  knex: Knex,
  approveRelation: ApproveRelation,
  userIds: { primary_id: number; association_id: number },
) {
  const updateColumns = approveRelation.isApproved
    ? "approved = true, rejected = false"
    : "approved = false, rejected = true";

  await knex.raw(`
    UPDATE relation 
    SET
      ${updateColumns} 
    WHERE
      primary_id = '${userIds.primary_id}'
      AND
      association_id = '${userIds.association_id}'
  `);
}

export async function addRelationDb(
  knex: Knex,
  relation: Relation,
  userIds: { primary_id: number; association_id: number },
): Promise<void> {
  try {
    await knex.raw(`
      WITH association_ids AS (
        SELECT
          id as "association_type_id"
        FROM
          association_type
        WHERE type = '${relation.associationType}'
      )
      INSERT INTO relation (
        approved,
        rejected,
        primary_id,
        association_id,
        association_type_id
      )
      SELECT
        NULL,
        NULL,
        ${userIds.primary_id},
        ${userIds.association_id},
        association_type_id
      FROM association_ids
    `);
  } catch (e: any) {
    if (e.routine === "_bt_check_unique") {
      throw new UniqueError(
        `${relation.primaryUsername} and ${relation.associatedUsername} are already Associated`,
      );
    }

    throw e;
  }
}
