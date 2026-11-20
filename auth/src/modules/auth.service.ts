import bcrypt from "bcryptjs";
import { db } from "../prisma/db.js";
import type { RegisterInput } from "./auth.validation.js";
import type { LoginInput } from "./auth.validation.js";
import { generateAcessToken } from "../utils/jwt.js";
import { generateRefreshToken, hashRefreshToken } from "../utils/token.js";

export async function registerUser(Input: RegisterInput){
    const {name, email, password} = Input

    const existingUser = await db.orm.public.User
    .whereUnique({email})
    .first()

    if(existingUser){
        throw new Error ("EMAIL_ALREADY EXISTS")
    }

    const hashPasswoed = await bcrypt.hash(password, 12)

    const user = await db.orm.public.User.create({
        name,
        email,
        password : hashPasswoed,
    })

    return {
        id : user.id,
        name : user.name,
        email :user.email,
        createdAt :user.createdAt
    }

}


export const loginUser = async (data: LoginInput) => {
    
    const user = await db.orm.public.User
    .whereUnique({ email: data.email })
    .first();
    
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAcessToken(user.id)

  const refreshToken = generateRefreshToken();

  const tokenHash = hashRefreshToken(refreshToken)

  await db.orm.public.RefreshToken.create({
      tokenHash,
      userId : user.id,
      expiresAt : new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      )
  })

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };

};