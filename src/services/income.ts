import { Knex } from "knex";
import { IncomeType } from "../types";
import { getUserWithUsername } from "../database/user";
import { AuthError, PayloadError } from "../error-handler/custom-errors";
import { addIncomeDb, getAllIncomesDb } from "../database/income";

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

  await addIncomeDb(knex, incomeType[0].id, user.id, payload);
}
