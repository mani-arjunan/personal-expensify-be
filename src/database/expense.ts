import { Knex } from "knex";
import { IncomeExpense, ExpenseType, ExpenseResponse } from "../types";
import momentTimeZone from "moment-timezone";
import { DATE_FORMAT } from "../constants";

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

export async function getExpenseDb(
  knex: Knex,
  expenseType: string,
  from: string,
  to: string,
  limit: number,
): Promise<Array<ExpenseResponse>> {
  console.log(knex.raw(`    SELECT
      amount as "amount",
      e.type as "expenseType",
      date
    FROM
      expense_transaction et
    JOIN
      expense e
    ON
      e.type = ${expenseType ? expenseType : "e.type"}
    WHERE
      e.id = expense_id
    ${
      from
        ? `AND
      et."date":: date >= date '${from}'
    AND
      et."date":: date < date '${to}'`
        : ""
    }
    ORDER BY et."date"
`).toSQL().sql.toString())
  const result = await knex.raw(`
    SELECT
      amount as "amount",
      e.type as "expenseType",
      date
    FROM
      expense_transaction et
    JOIN
      expense e
    ON
      e.type = ${expenseType ? expenseType : "e.type"}
    WHERE
      e.id = expense_id
    ${
      from
        ? `AND
      et."date":: date >= date '${from}'
    AND
      et."date":: date < date '${to}'`
        : ""
    }
    ORDER BY et."date"
    `);

  return result.rows as Array<ExpenseResponse>;
}
