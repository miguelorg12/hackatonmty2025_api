import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import pool from '../config/database';
import { User, Login, Register }  from '../interface/user.interface';

interface LoginResponse {
    user: Omit<User, 'password'>;
    token: string;
    expires_in: string;
}

export class AuthService {
    private static readonly JWT_SECRET: Secret = process.env.JWT_SECRET || "your-secret-key"
    private static readonly JWT_EXPIRES_IN = "24h" // Valor fijo para garantizar consistencia
    private static readonly SALT_ROUNDS = 12

    public static async register(userData : Register) : Promise<User> {
        const existingUser = await this.findUserByEmail(userData.email);
            if (existingUser) {
                throw new Error('User already exist');
            }
        
            const hashedPassword = await bcrypt.hash(userData.password, this.SALT_ROUNDS);

        const result = await pool.query(
            'INSERT INTO users(username, email, password, created_at, is_active) VALUES ($1, $2, $3, NOW(), true) RETURNING *',
            [userData.username, userData.email, hashedPassword]
        )
        return result.rows[0]
    }

    public static async findUserByEmail(email : string) : Promise<User | null > {
            const result = await pool.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            )
            return result.rows[0];
    }

    public static async login(credentials: Login): Promise<LoginResponse> {
        // Validar entrada
        if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required');
        }

        // Buscar usuario
        const existingUser = await this.findUserByEmail(credentials.email);
        if (!existingUser) {
            throw new Error('Invalid credentials');
        }

        // Verificar si la cuenta está activa
        if (!existingUser.is_active) {
            throw new Error('Account is not active');
        }

        // Validar contraseña
        const isValidPassword = await bcrypt.compare(
            credentials.password,
            existingUser.password || ''
        );

        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // Generar token JWT
        const token = this.generateToken(existingUser);
        
        // Remover la contraseña del objeto de usuario antes de devolverlo
        const { password, ...userWithoutPassword } = existingUser;

        return {
            user: userWithoutPassword,
            token,
            expires_in: this.JWT_EXPIRES_IN
        };
    }

    private static generateToken(user: User): string {
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username
        };

        try {
            return jwt.sign(payload, this.JWT_SECRET, {
                expiresIn: "24h" // Valor literal permitido por jwt.sign
            });
        } catch (error) {
            console.error('Token generation error:', error);
            throw new Error('Error generating authentication token');
        }
    }

    public static verifyToken(token: string): any {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET);
            
            // Verificar que el token decodificado tenga la estructura esperada
            if (typeof decoded === 'object' && decoded !== null && 
                'sub' in decoded && 'email' in decoded && 'username' in decoded) {
                return decoded;
            }
            
            throw new Error('Invalid token structure');
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Token has expired');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid token');
            }
            throw error;
        }
    }
}