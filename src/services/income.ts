import { Knex } from "knex";
import { IncomeResponse, IncomeType } from "../types";
import { getUserWithUsername } from "../database/user";
import { AuthError, PayloadError } from "../error-handler/custom-errors";
import { addIncomeDb, getAllIncomesDb, getIncomeDb } from "../database/income";
import { getDateType } from "../helpers";
import { DEFAULT_LIMIT } from "../constants";

export async function addIncome(knex: Knex, payload: IncomeType) {
  const user = await getUserWithUsername(knex, payload.username);

  if (!user) {
    throw new AuthError(`username is not found ${payload.username}`);
  }
  const incomes = await getAllIncomesDb(knex);
  const incomeType = incomes.filter(
    (income) => income.type === payload.incomeType,
  );

  if (incomeType.length === 0) {
    throw new PayloadError(
      `Invalid Income type ${
        payload.incomeType
      } supported incomeTypes: ${incomes
        .map((income) => income.type)
        .join(",")}`,
    );
  }
  const spliter = payload.date.includes("/") ? "/" : "-";
  const [date, month, year] = payload.date.split(spliter);
  payload = {
    ...payload,
    date: `${month}/${date}/${year}`,
  };

  await addIncomeDb(knex, incomeType[0].id, user.id, payload);
}

export async function getIncome(
  knex: Knex,
  queryParams: Record<string, unknown>,
): Promise<IncomeResponse[]> {
  let from: string = "";
  let to: string = "";
  const dateType = getDateType(queryParams);
  const range = (queryParams["range-date"] ||
    queryParams["range-month"] ||
    queryParams["range-year"]) as string;
  const limit = (queryParams.limit || DEFAULT_LIMIT) as number;
  const incomeType = queryParams["income-type"] as string;

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

  const incomes = await getIncomeDb(knex, incomeType, from, to, limit);

  return incomes.map((income) => ({
    ...income,
    date: `${new Date(income.date).getDate()}/${
      +new Date(income.date).getMonth() + 1
    }/${new Date(income.date).getFullYear()}`,
  }));
}
