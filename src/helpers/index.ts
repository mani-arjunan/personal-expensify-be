import { Request, Response } from "express";

export const getDateType = (queryParams: Record<string, unknown>): string => {
  if (queryParams["range-date"]) {
    return "date";
  } else if (queryParams["range-month"]) {
    return "month";
  }

  return "year";
};

export const methodNotAllowed = (req: Request, res: Response) =>
  res.status(404).send();
