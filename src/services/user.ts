import { Knex } from "knex";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { Login, User } from "../types";
import { environment } from "../environment";
import {
  closeUser,
  deleteRefreshTokenWithUserId,
  getAllUsersDb,
  getUserWithUsername,
  insertRefreshTokenDb,
  insertUserDb,
  updateUserDb,
} from "../database/user";
import { AuthError } from "../error-handler/custom-errors";

export async function getAllUsers(knex: Knex): Promise<Array<User>> {
  const users = getAllUsersDb(knex);

  return users;
}

function encryptPassword(password: string): string {
  const encryptedPassword = bcrypt.hashSync(password, 10);

  return encryptedPassword;
}

export function generateToken(payload: { username: string }): Login {
  const accessToken = jwt.sign(payload, environment.ACCESS_TOKEN_SECRET, {
    expiresIn: "24hr",
  });
  const refreshToken = jwt.sign(payload, environment.REFRESH_TOKEN_SECRET, {
    expiresIn: "365d",
  });

  return {
    accessToken,
    refreshToken,
  };
}

export async function updateUser(knex: Knex, userDetails: User): Promise<void> {
  if (!userDetails || !userDetails.username) {
    throw new AuthError(`User not found!`);
  }
  const user = {
    ...(userDetails.password
      ? { password: encryptPassword(userDetails.password) }
      : {}),
    ...(userDetails.martialStatus
      ? { martial_status: userDetails.martialStatus }
      : {}),
    ...(userDetails.sex ? { sex: userDetails.sex } : {}),
    ...(userDetails.age ? { age: userDetails.age } : {}),
    ...(userDetails.fullName ? { full_name: userDetails.fullName } : {}),
  };
  await updateUserDb(knex, userDetails.username, user as User);
  if (userDetails.password) {
    await logoutUser(knex, userDetails);
  }
}

export async function insertUser(knex: Knex, user: User): Promise<Login> {
  const password = encryptPassword(user.password);
  const userId = await insertUserDb(knex, {
    ...user,
    password,
  });
  const { accessToken, refreshToken } = generateToken({
    username: user.username,
  });
  await insertRefreshTokenDb(knex, userId.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    username: user.username,
  };
}

export async function deleteUser(
  knex: Knex,
  user: Pick<User, "username">,
): Promise<void> {
  await logoutUser(knex, user);
  await closeUser(knex, user.username);
}

export async function logoutUser(
  knex: Knex,
  user: Pick<User, "username">,
): Promise<void> {
  const userDetail = await getUserWithUsername(knex, user.username);
  if (!userDetail) {
    throw new AuthError("User not found!");
  }

  await deleteRefreshTokenWithUserId(knex, userDetail.id);
}

export async function loginUser(
  knex: Knex,
  user: Pick<User, "username" | "password">,
): Promise<Login> {
  const userDetails = await getUserWithUsername(knex, user.username);

  if (!userDetails) {
    throw new AuthError("User not found!");
  }
  const { password, username, id } = userDetails;
  const passwordCompare = await bcrypt.compare(user.password, password);

  if (!passwordCompare) {
    throw new AuthError("Invalid Password!");
  }
  const { accessToken, refreshToken } = generateToken({ username });
  await insertRefreshTokenDb(knex, id, refreshToken);

  return {
    accessToken,
    refreshToken,
    username: userDetails.username,
  };
}
