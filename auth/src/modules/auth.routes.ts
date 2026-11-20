import { Router, type Router as ExpressRouter } from "express";
import { registerController, loginController } from "./auth.controller.js";

const router : ExpressRouter = Router()

router.post("/register", registerController)
router.post("/login", loginController);

export default router