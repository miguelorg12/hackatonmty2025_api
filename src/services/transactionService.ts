import { Result } from "pg"
import db from "../config/database"
import { Transaction } from "../interface/transaction.interface"

export class TransactionService {
    public async getTransaction(id: number): Promise<Transaction> {
        const result = await db.query('SELECT * FROM transactions WHERE id = $1', [id]);
        return result.rows[0];
    }

    public async getAllTransactions():  Promise<Transaction[]> {
        const result = await db.query('SELECT * FROM transactions');
        return result.rows;
    }

    public async getAllTransactionsByCategoryId(category_id: number): Promise<Transaction[]> {
        const result = await db.query('SELECT * FROM transactions WHERE category_id = $1', [category_id])
        return result.rows;
    }

    public async createTransaction(transaction: Transaction): Promise<Transaction> {
        const result = await db.query('INSERT INTO transactions (business_id, category_id, amount, date, description, created_at, is_active) VALUES ($1, $2, $3, $4, $5, NOW(), true) RETURNING *', [transaction.business_id,transaction.category_id,transaction.amount,transaction.date,transaction.description]);
        return result.rows[0];
    }

    public async updateTransaction(id: number, data: Partial<Transaction>): Promise<Transaction> {
    const updatedData = {
        ...data,
        updated_at: new Date()
    };

    const result = await db.query(
        'UPDATE transactions SET business_id = COALESCE($1, business_id), category_id = COALESCE($2, category_id), amount = COALESCE($3, amount), description = COALESCE($4, description), date = COALESCE($5, date), updated_at = $6 WHERE id = $7 AND is_active = true RETURNING *',
        [updatedData.business_id, updatedData.category_id, updatedData.amount, updatedData.description, updatedData.date, updatedData.updated_at, id]
    );

    if (result.rows.length === 0) {
        throw new Error('Transaction not found');
    }

    return result.rows[0];
}

    public async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
        const result = await db.query(
            'SELECT * FROM transactions WHERE date >= $1 AND date <= $2 AND is_active = true ORDER BY date DESC',
            [startDate, endDate]
        );
        return result.rows;
    }

    public async getTransactionsByBusinessId(businessId: number): Promise<Transaction[]> {
        const result = await db.query(
            'SELECT * FROM transactions WHERE business_id = $1 AND is_active = true ORDER BY date DESC',
            [businessId]
        );
        return result.rows;
    }

    public async deleteTransaction(id: number): Promise<Transaction> {
        const result = await db.query('UPDATE transactions SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *', [id])
        return result.rows[0];
    }
}