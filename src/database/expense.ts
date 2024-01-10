import { Knex } from "knex";
import { IncomeExpense, ExpenseType } from "../types";

export async function getAllExpensesDb(
  knex: Knex,
): Promise<Array<IncomeExpense>> {
  const expenses = await knex.raw(`
    SELECT * FROM expense 
  `);

  return expenses.rows as Array<IncomeExpense>;
}

export async function addExpenseDb(
  knex: Knex,
  expenseId: number,
  userId: number,
  payload: ExpenseType,
): Promise<void> {
  await knex.raw(`
    INSERT INTO expense_transaction (
      user_id,
      expense_id,
      amount,
      date,
      private
    ) VALUES
    (
      ${userId},
      ${expenseId},
      ${payload.amount},
      '${new Date(new Date(payload.date).getTime()).toISOString()}',
      ${payload.private}
    )
  `);
}
