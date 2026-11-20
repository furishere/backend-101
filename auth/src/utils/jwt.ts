import jwt from "jsonwebtoken"

interface  AccessTokenPayload {
    userId : string
}

export const generateAcessToken = (userId: string) : string => {
    return jwt.sign(
        {userId} satisfies AccessTokenPayload,
        process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn : "15m"}
    )
}