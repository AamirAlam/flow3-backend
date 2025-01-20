import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";

export const auth = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("decoded :>> ", decoded);

    if (!decoded?.userId) {
      throw new Error("Invalid authentication token");
    }
    // verify that if requested user exists in db or not
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw new Error("Invalid user token! please login again");
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ errors: [{ message: error.message }] });
  }
};
