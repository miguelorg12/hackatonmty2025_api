import { body } from "express-validator";

export class CategoryValidator {
    static createCategory() {
        return [
            body('business_id')
                .isInt({ min: 1 })
                .withMessage('Valid business_id is required'),
            body('name')
                .trim()
                .notEmpty()
                .withMessage('Category name is required')
                .isLength({ max: 255 })
                .withMessage('Category name max 255 characters'),
            body('type')
                .trim()
                .notEmpty()
                .withMessage('Type is required'),
            body('is_default')
                .optional()
                .isBoolean()
                .withMessage('is_default must be boolean')
        ];
    }

    static updateCategory() {
        return [
            body('name')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Category name cannot be empty')
                .isLength({ max: 255 })
                .withMessage('Category name max 255 characters'),
            body('type')
                .optional()
                .trim(),
            body('is_default')
                .optional()
                .isBoolean()
                .withMessage('is_default must be boolean')
        ];
    }
}
