import { Response } from "express";
import { AuthError, PayloadError, UniqueError } from "./custom-errors";

function handleCustomErrors(res: Response, error: unknown) {
  if (error instanceof UniqueError) {
    res.status(409);
    res.send(error.message);
    return;
  }
  if (error instanceof AuthError) {
    res.status(401);
    res.send(error.message);
    return;
  }
  if (error instanceof PayloadError) {
    res.status(422);
    res.send(error.message);
    return;
  }

  res.status(500);
  res.send("Internal Server Error");
}

export async function handleErrors(
  res: Response,
  callback: () => unknown,
  statusCode: number,
) {
  try {
    const data = await callback();
    res.status(statusCode);
    res.send(data);
  } catch (e) {
    handleCustomErrors(res, e);
  }
}
