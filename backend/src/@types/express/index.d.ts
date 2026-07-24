import * as express from "express";

declare global {
  var token: string;
  namespace Express {
    interface Request {
      user: {
        id: string;
      };
    }
  }
}
