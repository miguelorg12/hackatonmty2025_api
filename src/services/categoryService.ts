import db from "../config/database";
import { Category } from "../interface/category.interface";

export class CategoryService {
    async getCategory(id: number): Promise<Category> {
        const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
        return result.rows[0];
    }

    async getCategoriesByBusinessId(business_id: number): Promise<Category[]> {
        const result = await db.query(
            'SELECT * FROM categories WHERE business_id = $1 AND is_active = true ORDER BY created_at DESC',
            [business_id]
        );
        return result.rows;
    }

    async getAllCategories(): Promise<Category[]> {
        const result = await db.query('SELECT * FROM categories WHERE is_active = true ORDER BY created_at DESC');
        return result.rows;
    }

    async createCategory(category: Category): Promise<Category> {
        const result = await db.query(
            `INSERT INTO categories (business_id, name, type, is_default, is_active, created_at) 
             VALUES ($1, $2, $3, $4, true, NOW()) RETURNING *`,
            [category.business_id, category.name, category.type, category.is_default || false]
        );
        return result.rows[0];
    }

    async updateCategory(id: number, category: Category): Promise<Category> {
        const result = await db.query(
            `UPDATE categories SET name = $1, type = $2, is_default = $3, updated_at = NOW() 
             WHERE id = $4 RETURNING *`,
            [category.name, category.type, category.is_default, id]
        );
        return result.rows[0];
    }

    async deactivateCategory(id: number): Promise<Category> {
        const result = await db.query(
            'UPDATE categories SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    }
}
