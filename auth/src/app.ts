import express, {type Express} from "express"
import authRouter from "./modules/auth.routes.js"

const app : Express = express()

app.use(express.json())

app.use("/api/auth", authRouter)

export default app