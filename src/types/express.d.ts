import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        [key: string]: any; // Add more properties if needed
      };
    }
  }
}
