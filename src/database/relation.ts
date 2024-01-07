import { Knex } from "knex";
import {
  ApproveRelation,
  PendingRelation,
  Relation,
  SentRelation,
} from "../types";
import { UniqueError } from "../error-handler/custom-errors";

export async function getMyRealtionsDb(
  knex: Knex,
  userId: number,
): Promise<PendingRelation> {
  return (
    await knex.raw(`
      SELECT
        u.username as "username",
        at.type as "associationType"    
      FROM
        relation r
      JOIN
        users u
      ON
        r.association_id = u.id
      JOIN
        association_type at
      ON
        at.id = r.association_type_id
      WHERE
        r.primary_id = ${userId}
      AND
        r.approved = true
    `)
  ).rows;
}

export async function getSentRelationsDb(
  knex: Knex,
  userId: number,
): Promise<SentRelation> {
  return (
    await knex.raw(`
      SELECT
        u.username as "username",
        CASE
          WHEN r.approved IS NULL AND r.rejected IS NULL THEN 'pending'
          WHEN r.approved = true THEN 'approved'
          ELSE 'rejected'
        END AS "status"
      FROM
        relation r
      JOIN
        users u
      ON
        r.association_id = u.id
      WHERE
        r.primary_id = ${userId}
    `)
  ).rows;
}

export async function getPendingRelationsDb(
  knex: Knex,
  userId: number,
): Promise<Array<PendingRelation>> {
  return (
    await knex.raw(`
    SELECT
      u.username as "username",
      at.type as "requestedAssociationType"
    FROM
      relation r
    JOIN
      users u
    ON
      r.primary_id = u.id
    JOIN
      association_type at
    ON
      at.id = r.association_type_id
    WHERE
      r.association_id = ${userId}
    AND
      r.approved IS NULL
    AND
      r.rejected IS NULL
  `)
  ).rows;
}

export async function canApproveDb(
  knex: Knex,
  userIds: { primary_id: number; association_id: number },
): Promise<{ approved: boolean; rejected: boolean }> {
  return (
    await knex.raw(`
      SELECT
        approved,
        rejected
      FROM
        relation 
      WHERE
        primary_id = '${userIds.primary_id}'
        AND
        association_id = '${userIds.association_id}'
    `)
  ).rows[0];
}

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
