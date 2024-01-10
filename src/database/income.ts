import { Knex } from "knex";
import { IncomeExpense, IncomeType } from "../types";

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
