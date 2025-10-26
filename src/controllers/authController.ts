import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { validationResult } from 'express-validator'

export class AuthController {
    public register = async (req: Request, res: Response) : Promise<any> =>{
        try {
            const result = validationResult(req);
            if(!result.isEmpty())
            {
                return res.status(422).json({
                    message: "Validation error.",
                    success: false,
                    errors: result.array()
                });
            }
            const { email, password, username } = req.body;

            const register = await AuthService.register({
                email,
                password,
                username
            });

            res.status(201).json({
                success: true,
                message: 'User succesfully registered.',
                data: register.email
            });
            res.status(200).json({
                success: true,
                message: "Login successful"
            });
        } catch (error: any) {
            console.error('Login error:', error);

            const statusCode = error.message === 'Invalid credentials' ? 401 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Error during login'
            });
        }
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                res.status(422).json({
                    success: false,
                    message: "Validation error",
                    errors: result.array()
                });
                return;
            }

            const loginResult = await AuthService.login({
                email: req.body.email,
                password: req.body.password
            });

            // Enviar respuesta con el token incluido
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: loginResult.user.id,
                        email: loginResult.user.email,
                        username: loginResult.user.username
                    },
                    token: loginResult.token,
                    expires_in: loginResult.expires_in
                }
            });
        } catch (error: any) {
            console.error('Login error:', error);
            
            const statusCode = error.message === 'Invalid credentials' ? 401 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Error during login'
            });
        }
    }
}
