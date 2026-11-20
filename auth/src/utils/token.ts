import cryptp from "node:crypto"

export const generateRefreshToken = () : string => {
    return cryptp.randomBytes(64).toString("hex")
}

export const hashRefreshToken = (token:string): string => {
    return cryptp.createHash("sha256").update(token).digest("hex")
}