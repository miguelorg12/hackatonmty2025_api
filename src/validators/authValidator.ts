import { body } from 'express-validator';

export class AuthValidator {
    static register() {
        return [
            body('email')
                .notEmpty().withMessage('Email is required.')
                .isEmail().withMessage('Email must be valid.'),
            body('password')
                .notEmpty().withMessage('Password is required.')
                .isLength({ min: 8 }).withMessage('The lenght of the password its min 8 characters')
                .matches(/[0-9]/).withMessage('Password must contain at least a number.')
                .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
                .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
                .matches(/[\W_]/).withMessage('Password must contain at least one special character.'),
            body('username')
                .notEmpty().withMessage('Username is required.')
                .isString().withMessage('Username must be a string.')
                .isLength({ min: 8, max: 50 }).withMessage('The lenght of the username its min 8 characters and max 50 characters'),
        ];
    }

    static login() {
        return [
            body('email')
                .notEmpty().withMessage('Email is required.')
                .isEmail().withMessage('Email must be valid.'),
            body('password')
                .notEmpty().withMessage('Password is required')
        ]
    }
}