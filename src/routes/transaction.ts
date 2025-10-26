import { Router } from "express";
import { TransactionController } from "../controllers/transactionController";
import { TransactionValidator } from "../validators/transactionValidator";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const transactionRouter = Router();
const transaction = new TransactionController();

// Rutas protegidas que requieren autenticación
// GET todas las transacciones
transactionRouter.get(
    "/",
    AuthMiddleware.verifyToken,
    transaction.getAllTransactions
);

// GET una transacción específica por ID
transactionRouter.get(
    "/:id",
    AuthMiddleware.verifyToken,
    transaction.getTransaction
);

// GET transacciones por categoría
transactionRouter.get(
    "/category/:categoryId",
    AuthMiddleware.verifyToken,
    TransactionValidator.getTransactionsByCategory(),
    transaction.getTransactionsByCategory
);

// POST crear nueva transacción
transactionRouter.post(
    "/",
    AuthMiddleware.verifyToken,
    TransactionValidator.createTransaction(),
    transaction.createTransaction
);

// PUT actualizar transacción existente
transactionRouter.put(
    "/:id",
    AuthMiddleware.verifyToken,
    TransactionValidator.updateTransaction(),
    transaction.updateTransaction
);

// DELETE eliminar transacción (soft delete)
transactionRouter.delete(
    "/:id",
    AuthMiddleware.verifyToken,
    transaction.deleteTransaction
);

// GET transacciones por negocio
transactionRouter.get(
    "/business/:businessId",
    AuthMiddleware.verifyToken,
    TransactionValidator.getTransactionsByBusinessId(),
    transaction.getTransactionsByBusinessId
);

export default transactionRouter;
