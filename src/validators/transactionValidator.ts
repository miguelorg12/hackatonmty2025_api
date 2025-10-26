import { body } from "express-validator"

export class TransactionValidator {
    static createTransaction() {
        return [
            body('business_id')
                .notEmpty().withMessage('Business ID is required')
                .isInt({ min: 1 }).withMessage('Business ID must be a valid integer'),
            
            body('category_id')
                .notEmpty().withMessage('Category ID is required')
                .isInt({ min: 1 }).withMessage('Category ID must be a valid integer'),
            
            body('amount')
                .notEmpty().withMessage('Amount is required')
                .isFloat({ min: 0.01 }).withMessage('Amount must be a valid number greater than 0')
                .custom((value) => {
                    if (isNaN(parseFloat(value))) {
                        throw new Error('Amount must be a valid number');
                    }
                    return true;
                }),
            
            body('description')
                .optional()
                .isString().withMessage('Description must be a string')
                .trim()
                .isLength({ min: 3, max: 255 })
                .withMessage('Description must be between 3 and 255 characters'),
            
            body('date')
                .optional()
                .isISO8601().withMessage('Date must be a valid ISO 8601 date')
                .custom((value) => {
                    const date = new Date(value);
                    const now = new Date();
                    if (date > now) {
                        throw new Error('Transaction date cannot be in the future');
                    }
                    return true;
                })
        ];
    }

    static updateTransaction() {
        return [
            body('business_id')
                .optional()
                .isInt({ min: 1 }).withMessage('Business ID must be a valid integer'),
            
            body('category_id')
                .optional()
                .isInt({ min: 1 }).withMessage('Category ID must be a valid integer'),
            
            body('amount')
                .optional()
                .isFloat({ min: 0.01 }).withMessage('Amount must be a valid number greater than 0')
                .custom((value) => {
                    if (value && isNaN(parseFloat(value))) {
                        throw new Error('Amount must be a valid number');
                    }
                    return true;
                }),
            
            body('description')
                .optional()
                .isString().withMessage('Description must be a string')
                .trim()
                .isLength({ min: 3, max: 255 })
                .withMessage('Description must be between 3 and 255 characters'),
            
            body('date')
                .optional()
                .isISO8601().withMessage('Date must be a valid ISO 8601 date')
                .custom((value) => {
                    if (value) {
                        const date = new Date(value);
                        const now = new Date();
                        if (date > now) {
                            throw new Error('Transaction date cannot be in the future');
                        }
                    }
                    return true;
                })
        ];
    }

    static getTransactionsByDateRange() {
        return [
            body('start_date')
                .notEmpty().withMessage('Start date is required')
                .isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
            
            body('end_date')
                .notEmpty().withMessage('End date is required')
                .isISO8601().withMessage('End date must be a valid ISO 8601 date')
                .custom((endDate, { req }) => {
                    const startDate = new Date(req.body.start_date);
                    const end = new Date(endDate);
                    if (end < startDate) {
                        throw new Error('End date must be after start date');
                    }
                    return true;
                })
        ];
    }

    static getTransactionsByBusinessId() {
        return [
            body('business_id')
                .notEmpty().withMessage('Business ID is required')
                .isInt({ min: 1 }).withMessage('Business ID must be a valid integer')
        ];
    }

    static getTransactionsByCategory() {
        return [
            body('category_id')
                .notEmpty().withMessage('Category ID is required')
                .isInt({ min: 1 }).withMessage('Category ID must be a valid integer')
        ];
    }
}