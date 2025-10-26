import { Request, Response } from "express";
import { CategoryService } from "../services/categoryService";
import { validationResult } from "express-validator";

const categoryService = new CategoryService();

export class CategoryController {

    getCategories = async (req: Request, res: Response): Promise<any> => {
        try { 
            const categories = await categoryService.getAllCategories();
            if (categories.length === 0) {
                return res.status(404).json({ success: false, message: 'No categories found' });
            }
            return res.status(200).json({ success: true, data: categories });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    };

    getCategory = async (req: Request, res: Response): Promise<any> => {
        try {
            const id = parseInt(req.params.id);
            const category = await categoryService.getCategory(id);
            
            if (!category) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }
            
            return res.status(200).json({ success: true, data: category });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    };

    getCategoriesByBusinessId = async (req: Request, res: Response): Promise<any> => {
        try {
            const businessId = parseInt(req.params.businessId);
            const categories = await categoryService.getCategoriesByBusinessId(businessId);
            if (categories.length === 0) {
                return res.status(404).json({ success: false, message: 'No categories found for this business' });
            }
            return res.status(200).json({ success: true, data: categories });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    };

    createCategory = async (req: Request, res: Response): Promise<any> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() });
            }
            
            const category = await categoryService.createCategory(req.body);
            if (!category) {
                return res.status(400).json({ success: false, message: 'Error creating category' });
            }
            
            return res.status(201).json({ success: true, message: 'Category created successfully', data: category });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to create category' });
        }
    };

    updateCategory = async (req: Request, res: Response): Promise<any> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() });
            }

            const id = parseInt(req.params.id);
            let existingCategory = await categoryService.getCategory(id);
            
            if (!existingCategory) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }
            
            const updatedCategory = await categoryService.updateCategory(id, req.body);
            return res.status(200).json({ success: true, message: 'Category updated successfully', data: updatedCategory });
        } catch (error) {
            console.error('Error in updateCategory:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Error updating category',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    deactivateCategory = async (req: Request, res: Response): Promise<any> => {
        try {
            const id = parseInt(req.params.id);
            let existingCategory = await categoryService.getCategory(id);
            
            if (!existingCategory) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }
            
            const deactivatedCategory = await categoryService.deactivateCategory(id);
            return res.status(200).json({ 
                success: true, 
                message: 'Category deactivated successfully', 
                data: deactivatedCategory 
            });
        } catch (error) {
            console.error('Error in deactivateCategory:', error);
            return res.status(500).json({ success: false, message: 'Error deactivating category' });
        }
    };
}
