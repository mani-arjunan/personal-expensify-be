import { Knex } from "knex";
import { IncomeExpense, IncomeResponse, IncomeType } from "../types";

export async function getAllIncomesDb(
  knex: Knex,
): Promise<Array<IncomeExpense>> {
  const incomes = await knex.raw(`
    SELECT * FROM income
  `);

  return incomes.rows as Array<IncomeExpense>;
}

export async function addIncomeDb(
  knex: Knex,
  incomeId: number,
  userId: number,
  payload: IncomeType,
): Promise<void> {
  await knex.raw(`
    INSERT INTO income_transaction (
      user_id,
      income_id,
      amount,
      date,
      private
    ) VALUES
    (
      ${userId},
      ${incomeId},
      ${payload.amount},
      '${new Date(new Date(payload.date).getTime()).toISOString()}',
      ${payload.private}
    )
  `);
}

export async function getIncomeDb(
  knex: Knex,
  incomeType: string,
  from: string,
  to: string,
  limit: number,
): Promise<Array<IncomeResponse>> {
  const result = await knex.raw(`
    SELECT
      amount as "amount",
      i.type as "incomeType",
      date
    FROM
      income_transaction it
    JOIN
      income i
    ON
      i.type = ${incomeType ? incomeType : "i.type"}
    WHERE
      i.id = income_id 
    ${
      from
        ? `AND
      it."date":: date >= date '${from}'
    AND
      it."date":: date < date '${to}'`
        : ""
    }
    ORDER BY it."date"
    `);

  return result.rows as Array<IncomeResponse>;
}
