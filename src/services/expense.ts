import { Knex } from "knex";
import { ExpenseType } from "../types";
import { getUserWithUsername } from "../database/user";
import { AuthError, PayloadError } from "../error-handler/custom-errors";
import { addExpenseDb, getAllExpensesDb } from "../database/expense";

export async function addExpense(knex: Knex, payload: ExpenseType) {
  const user = await getUserWithUsername(knex, payload.username);

  if (!user) {
    throw new AuthError(`username is not found ${payload.username}`);
  }
  const expenses = await getAllExpensesDb(knex);
  const expenseType = expenses.filter(
    (expense) => expense.type === payload.expenseType,
  );

  if (expenseType.length === 0) {
    throw new PayloadError(
      `Invalid Income type ${
        payload.expenseType
      } supported incomeTypes: ${expenses
        .map((expense) => expense.type)
        .join(",")}`,
    );
  }

  await addExpenseDb(knex, expenseType[0].id, user.id, payload);
}
