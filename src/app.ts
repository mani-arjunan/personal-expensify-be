import express from "express";
import { Server } from "http";
import { json, urlencoded } from "body-parser";

import { logger } from "./helpers/logger";
import { environment } from "./environment";
import {} from "./validation/validate";
import { routes } from "./routes";
import { DatabaseConnection } from "./connection";

const { log, info, error } = logger;
const app = express();
let server: Server | null;

async function shutDownSystem(code?: string): Promise<void> {
  info("Server is shutdown with code: ", code);

  const shutDownServer = (): Promise<void> => {
    return new Promise((res, rej) => {
      if (server) {
        info("Server is Closing now");
        server.close(() => res());
      } else {
        info("Express server is not initialized");
        res();
      }
    });
  };

  try {
    await shutDownServer();
    await DatabaseConnection.shutdown()
  } catch (e) {
    error("Eror in shutting down the server: ", e);
  }
}

async function startupSystem(): Promise<void> {
  app.use(urlencoded({ extended: false }));
  app.use(json());

  app.use('/', routes())

  process.on("SIGINT", shutDownSystem);
  process.on("SIGTERM", shutDownSystem);

  return new Promise((res, rej) => {
    try {
      server = app.listen(environment.PORT, () => {
        info("Server is running at: ", environment.PORT);
        res();
      });
    } catch (e) {
      rej();
      error("Error in starting server: ", e);
    }
  });
}

startupSystem().catch((err) => error("System didn't started properly", err));
