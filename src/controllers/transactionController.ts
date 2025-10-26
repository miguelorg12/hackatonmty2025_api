import { Request, Response } from 'express';
import { TransactionService } from '../services/transactionService';
import { validationResult } from 'express-validator';

export class TransactionController {
    private transactionService: TransactionService;

    constructor() {
        this.transactionService = new TransactionService();
    }

    public getTransaction = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid transaction ID'
                });
                return;
            }

            const transaction = await this.transactionService.getTransaction(id);
            
            if (!transaction) {
                res.status(404).json({
                    success: false,
                    message: 'Transaction not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: transaction
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving transaction'
            });
        }
    }

    public getAllTransactions = async (req: Request, res: Response): Promise<void> => {
        try {
            const transactions = await this.transactionService.getAllTransactions();
            
            res.status(200).json({
                success: true,
                data: transactions
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving transactions'
            });
        }
    }

    public getTransactionsByCategory = async (req: Request, res: Response): Promise<void> => {
        try {
            const categoryId = parseInt(req.params.categoryId);
            if (isNaN(categoryId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid category ID'
                });
                return;
            }

            const transactions = await this.transactionService.getAllTransactionsByCategoryId(categoryId);
            
            res.status(200).json({
                success: true,
                data: transactions
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving transactions by category'
            });
        }
    }

    public createTransaction = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                res.status(422).json({
                    success: false,
                    message: 'Validation error',
                    errors: result.array()
                });
                return;
            }

            const { business_id, category_id, amount, date, description } = req.body;
            
            const transaction = await this.transactionService.createTransaction({
                business_id,
                category_id,
                amount,
                date: date ? new Date(date) : new Date(),
                description
            });

            res.status(201).json({
                success: true,
                message: 'Transaction created successfully',
                data: transaction
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error creating transaction'
            });
        }
    }

    public updateTransaction = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                res.status(422).json({
                    success: false,
                    message: 'Validation error',
                    errors: result.array()
                });
                return;
            }

            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid transaction ID'
                });
                return;
            }

            // Verificar que la transacción existe
            const existingTransaction = await this.transactionService.getTransaction(id);
            if (!existingTransaction) {
                res.status(404).json({
                    success: false,
                    message: 'Transaction not found'
                });
                return;
            }

            const { amount, date, description } = req.body;
            
            const updatedTransaction = await this.transactionService.updateTransaction(id, {
                amount: amount || existingTransaction.amount,
                date: date ? new Date(date) : existingTransaction.date,
                description: description || existingTransaction.description
            });

            res.status(200).json({
                success: true,
                message: 'Transaction updated successfully',
                data: updatedTransaction
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error updating transaction'
            });
        }
    }

    public deleteTransaction = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid transaction ID'
                });
                return;
            }

            // Verificar que la transacción existe
            const existingTransaction = await this.transactionService.getTransaction(id);
            if (!existingTransaction) {
                res.status(404).json({
                    success: false,
                    message: 'Transaction not found'
                });
                return;
            }

            // Realizar un soft delete actualizando is_active a false
            await this.transactionService.updateTransaction(id, {
                ...existingTransaction,
                is_active: false
            });

            res.status(200).json({
                success: true,
                message: 'Transaction deleted successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error deleting transaction'
            });
        }
    }

    public getTransactionsByBusinessId = async (req: Request, res: Response): Promise<void> => {
        try {
            const businessId = parseInt(req.params.businessId);
            if (isNaN(businessId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid business ID'
                });
                return;
            }

            const transactions = await this.transactionService.getTransactionsByBusinessId(businessId);

            res.status(200).json({
                success: true,
                data: transactions
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving transactions by business'
            });
        }
    }
}
