import { body } from "express-validator";

export class ScenarioValidator {
    static createScenario() {
        return [
            body('business_id')
                .isInt({ min: 1 })
                .withMessage('Valid business_id is required'),
            body('name')
                .trim()
                .notEmpty()
                .withMessage('Scenario name is required')
                .isLength({ max: 255 })
                .withMessage('Scenario name max 255 characters'),
            body('income_multiplier')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Income multiplier must be a positive number'),
            body('expense_multiplier')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Expense multiplier must be a positive number'),
            body('payment_delay_days')
                .optional()
                .isInt({ min: 0 })
                .withMessage('Payment delay days must be a non-negative integer')
        ];
    }

    static updateScenario() {
        return [
            body('name')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Scenario name cannot be empty')
                .isLength({ max: 255 })
                .withMessage('Scenario name max 255 characters'),
            body('income_multiplier')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Income multiplier must be a positive number'),
            body('expense_multiplier')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Expense multiplier must be a positive number'),
            body('payment_delay_days')
                .optional()
                .isInt({ min: 0 })
                .withMessage('Payment delay days must be a non-negative integer')
        ];
    }
}