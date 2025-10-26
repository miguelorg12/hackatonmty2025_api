import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

// Extender la interfaz Request para incluir el usuario autenticado
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                email: string;
                username: string;
            };
        }
    }
}

export class AuthMiddleware {
    public static async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Obtener el token del header Authorization
            const authHeader = req.headers.authorization;
            
            if (!authHeader) {
                res.status(401).json({
                    success: false,
                    message: 'No token provided'
                });
                return;
            }

            // Verificar que el token sea de tipo Bearer
            const parts = authHeader.split(' ');
            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                res.status(401).json({
                    success: false,
                    message: 'Token error'
                });
                return;
            }

            const token = parts[1];

            // Verificar y decodificar el token
            const decoded = await AuthService.verifyToken(token);
            
            // Agregar la información del usuario decodificada a la request
            req.user = {
                userId: decoded.sub,
                email: decoded.email,
                username: decoded.username
            };

            // Continuar con la siguiente función
            next();
        } catch (error: any) {
            res.status(401).json({
                success: false,
                message: error.message || 'Invalid token'
            });
        }
    }
}