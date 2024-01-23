import { Knex } from "knex";
import { ExpenseResponse, ExpenseType } from "../types";
import { getUserWithUsername } from "../database/user";
import { AuthError, PayloadError } from "../error-handler/custom-errors";
import {
  addExpenseDb,
  getAllExpensesDb,
  getExpenseDb,
} from "../database/expense";
import { DEFAULT_LIMIT } from "../constants";
import { getDateType } from "../helpers";

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
  const spliter = payload.date.includes("/") ? "/" : "-";
  const [date, month, year] = payload.date.split(spliter);
  payload = {
    ...payload,
    date: `${month}/${date}/${year}`,
  };

  await addExpenseDb(knex, expenseType[0].id, user.id, payload);
}

export async function getExpense(
  knex: Knex,
  queryParams: Record<string, unknown>,
): Promise<ExpenseResponse[]> {
  let from: string = "";
  let to: string = "";
  const dateType = getDateType(queryParams);
  const range = (queryParams["range-date"] ||
    queryParams["range-month"] ||
    queryParams["range-year"]) as string;
  const limit = (queryParams.limit || DEFAULT_LIMIT) as number;
  const expenseType = queryParams["expense-type"] as string;

  if (range) {
    if (dateType === "date") {
      const splitedDate = range.split("-");
      const [fromDate, fromMonth, fromYear] = splitedDate[0].split("/");
      const [toDate, toMonth, toYear] = splitedDate[1].split("/");
      from = new Date(`${fromMonth}/${fromDate}/${fromYear}`).toISOString();
      to = new Date(`${toMonth}/${toDate}/${toYear}`).toISOString();
    }
    if (dateType === "month") {
      const splitedDate = range.split("-");
      const fromSplit = splitedDate[0].split("/");
      const toSplit = splitedDate[1].split("/");
      from = new Date(
        new Date(new Date(1).setMonth(+fromSplit[0] - 1)).setFullYear(
          +fromSplit[1],
        ),
      ).toISOString();
      to = new Date(
        new Date(new Date(1).setMonth(+toSplit[0] - 1)).setFullYear(
          +toSplit[1],
        ),
      ).toISOString();
    }
    if (dateType === "year") {
      const splitedDate = range.split("-");

      from = new Date(new Date(1).setFullYear(+splitedDate[0])).toISOString();
      to = new Date(new Date(1).setFullYear(+splitedDate[1])).toISOString();
    }
  }

  const expenses = await getExpenseDb(knex, expenseType, from, to, limit);

  return expenses.map((expense) => ({
    ...expense,
    date: `${new Date(expense.date).getDate()}/${
      +new Date(expense.date).getMonth() + 1
    }/${new Date(expense.date).getFullYear()}`,
  }));
}
