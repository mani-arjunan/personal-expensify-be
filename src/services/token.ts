import { Knex } from "knex";
import jwt from "jsonwebtoken";

import { LoginToken } from "../types";
import { generateToken } from "./user";
import { environment } from "../environment";
import { getRefreshToken, getUser } from "../database/user";
import { AuthError } from "../error-handler/custom-errors";

export async function createAccessToken(
  knex: Knex,
  refreshToken: string,
): Promise<{ accessToken: string }> {
  const tokenDetails = await getRefreshToken(knex, refreshToken);
  if(!tokenDetails) {
    throw new AuthError("Sesssion Expired or User loggedout!")
  }
  const { username } = await getUser(knex, tokenDetails.userId);
  const { accessToken } = generateToken({ username });

  return { accessToken };
}
