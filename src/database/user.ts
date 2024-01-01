import { Knex } from "knex";
import { RefreshToken, User } from "../types";
import { UniqueError } from "../error-handler/custom-errors";

export async function getAllUsersDb(knex: Knex): Promise<Array<User>> {
  const users = (
    await knex.raw(`
    SELECT * FROM users
  `)
  ).rows as Array<User>;

  return users;
}


export async function updateUserDb(
  knex: Knex,
  username: string,
  user: User,
): Promise<void> {
  const columnsToUpdate = Object.keys(user).reduce((acc: string[], key) => {
    acc = [
      ...acc,
      `${key} = '${user[key]}'`
    ]
    return acc  
  }, [])

  await knex.raw(`
    UPDATE
      users
    SET
      ${columnsToUpdate.join(', ')} 
    WHERE
      username = '${username}'
  `)
}

export async function insertUserDb(
  knex: Knex,
  user: User,
): Promise<{ id: number }> {
  let users: Array<{ id: number }> = [];
  try {
    users = (
      await knex.raw(`
        INSERT INTO users (
        username,
        password,
        age,
        full_name,
        sex,
        martial_status
        )
        VALUES (
        '${user.username}',
        '${user.password}',
        '${user.age}',
        '${user.fullName}',
        '${user.sex}',
        '${user.martialStatus}'
        )
        RETURNING id
    `)
    ).rows as Array<{ id: number }>;
  } catch (e: any) {
    if (e.routine === "_bt_check_unique") {
      throw new UniqueError(`${e.detail}`);
    }

    throw e;
  }

  return users[0];
}

export async function insertRefreshTokenDb(
  knex: Knex,
  userId: number,
  refreshToken: string,
): Promise<void> {
  await knex.raw(`
    INSERT INTO token (
      user_id,
      refresh_token
    )
    VALUES (
      ${userId},
      '${refreshToken}'
    )
  `);
}

export async function getUserWithUsername(
  knex: Knex,
  username: string,
): Promise<Pick<User, "id" | "username" | "password">> {
  const user = (
    await knex.raw(`
    SELECT
      id,
      username,
      password
    FROM
      users
    WHERE
      username = '${username}'
  `)
  ).rows as User;

  return user[0];
}

export async function getUser(
  knex: Knex,
  userId?: number,
): Promise<Pick<User, "username">> {
  const user = (
    await knex.raw(`
    SELECT
      username
    FROM
      users
    WHERE
      id = ${userId}
  `)
  ).rows as User;

  return user[0];
}
export async function getRefreshToken(
  knex: Knex,
  refreshToken: string,
): Promise<RefreshToken> {
  const token = (
    await knex.raw(`
    SELECT
      user_id as "userId",
      refresh_token as "refreshToken" 
    FROM
      token
    WHERE
      refresh_token = '${refreshToken}'
  `)
  ).rows as Array<RefreshToken>;

  return token[0];
}

export async function checkAndRemoveRefreshToken(
  knex: Knex,
  refreshToken: string,
): Promise<void> {
  const token = await getRefreshToken(knex, refreshToken);

  if (token) {
    await deleteRefreshToken(knex, refreshToken);
  }

  return;
}

export async function closeUser(knex: Knex, username: string): Promise<void> {
  await knex.raw(`
    DELETE FROM users WHERE username ='${username}'
  `);
}

export async function deleteRefreshTokenWithUserId(
  knex: Knex,
  userId: number,
): Promise<void> {
  await knex.raw(`
    DELETE FROM token WHERE user_id = ${userId}
  `);
}

export async function deleteRefreshToken(
  knex: Knex,
  refreshToken: string,
): Promise<void> {
  await knex.raw(`
    DELETE FROM token WHERE refresh_token = '${refreshToken}'
  `);
}
