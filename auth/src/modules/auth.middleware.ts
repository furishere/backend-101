
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AccessTokenPayload {
  userId: string;
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access token is missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Access token is missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as AccessTokenPayload;

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
}
