import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { AuthValidator } from "../validators/authValidator";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const authRouter = Router();
const auth = new AuthController();

authRouter.post('/register', AuthValidator.register(), auth.register);
authRouter.post('/login', AuthValidator.login(), auth.login);
authRouter.put(
    '/update/:id',
    AuthMiddleware.verifyToken,
    AuthValidator.updateUser(),
    auth.updateUser
);

export default authRouter;
