import knex, { Knex } from "knex";
import { environment } from "../environment";

export class DatabaseConnection {
  private static _knex: Knex | null = null;

  constructor() {}

  init(): knex.Knex {
    return knex({
      client: "pg",
      connection: environment.DATABASE_URL,
      searchPath: ["public"],
    });
  }

  static shutdown(): Promise<void> {
    return new Promise((res, rej) => {
      if (this._knex) {
        this._knex.destroy();
        res();
      } else {
        rej("Database was not initialized");
      }
    });
  }

  static get knex(): Knex {
    if (!this._knex) {
      this._knex = new DatabaseConnection().init();
    }
    return this._knex as Knex;
  }
}
