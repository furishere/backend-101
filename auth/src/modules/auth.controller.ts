import type { Request, Response,  NextFunction } from "express";

import { registerSchema } from "./auth.validation.js";
import { registerUser } from "./auth.service.js";

import { loginSchema } from "./auth.validation.js";
import { loginUser } from "./auth.service.js";

export async function registerController(
  req: Request,
  res: Response
) {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    const user = await registerUser(result.data);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      if (
        "sqlState" in error &&
        error.sqlState === "23505"
      ) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {

    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { user, accessToken, refreshToken } =
      await loginUser(result.data);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });

    return res.status(200).json({
      message: "Login successful",
      user,
      accessToken,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_EMAIL_OR_PASSWORD"
    ) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    next(error);
  }
}
