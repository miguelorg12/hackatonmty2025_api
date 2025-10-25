import { body } from "express-validator";

export class BussinesValidator {
    static createBussines(){
        return[
        body('enterprise_name')
        .notEmpty().withMessage('Enterprise name is required')
        .isString().withMessage('Enterprise name must be a string'),
        body('business_type')
        .notEmpty()
        .withMessage('Business type is required')
        .isString().withMessage('Business type must be a string'),
        body('initial_balance')
        .notEmpty()
        .withMessage('Initial balance is required')
        .isFloat({ gt: 0 }).withMessage('Initial balance must be a number greater than 0'),
        body('user_id')
        .notEmpty()
        .withMessage('User ID is required')
        .isInt({ min: 1 }).withMessage('User ID must be a positive integer')
    ]
    }

    static updateBussines(){
        return[
            body('enterprise_name')
            .optional()
            .isString().withMessage('Enterprise name must be a string'),
            body('business_type')
            .optional()
            .isString().withMessage('Business type must be a string'),
            body('initial_balance')
            .optional()
            .isFloat({ gt: 0 }).withMessage('Initial balance must be a number greater than 0'),
        ]
    }
}