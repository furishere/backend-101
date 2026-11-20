import type { Request, Response } from "express";

export async function getProfile(
  req: Request,
  res: Response
) {
  return res.status(200).json({
    message: "Profile fetched successfully",
    userId: req.user?.userId,
  });
}