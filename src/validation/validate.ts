import { NextFunction, Request, Response } from 'express';
import schema from './schema/schema.json'
import jwt from 'jsonwebtoken';
import { environment } from '../environment';



export function validateRefreshToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if(!authHeader) {
    res.status(401);
    res.send('Token not present');
    return
  } else {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, environment.REFRESH_TOKEN_SECRET, (err: unknown, data: unknown) => {
      if(err) {
        res.status(403)
        res.send('Invalid refresh token')
        return
      } else {
        req.headers = {
          ...req.headers,
          userData: data as string
        }
        next();
        return;
      }
    })
  }

}

export function validateAccessToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if(!authHeader) {
    res.status(401);
    res.send('Token not present');
    return
  } else {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, environment.ACCESS_TOKEN_SECRET, (err: unknown, data: unknown) => {
      if(err) {
        res.status(403)
        res.send('Invalid access token')
        return
      } else {
        req.headers = {
          ...req.headers,
          userData: data as string
        }
        next();
        return
      }
    })
  }

}

console.log(schema)
