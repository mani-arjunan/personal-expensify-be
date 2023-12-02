import { Server } from "http";
import { logger } from "./helpers/logger";
import express from 'express'

const { log, info, error } = logger;
const app = express();
let server: Server | null;

async function startupSystem(): Promise<Express.Application> { 
  return new Promise((res, rej) => {
    try {
      server = app.listen()
    } catch(e) {

    }
  })

}

startupSystem().catch((err) => error("System didn't started properly", err));
