import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { AuthValidator } from "../validators/authValidator";

const authRouter = Router();
const auth = new AuthController();

authRouter.post('/register', AuthValidator.register(), auth.register);
authRouter.post('/login', AuthValidator.login(), auth.login);

export default authRouter;
