import { Router } from "express";
import geminiRoutes from "./gemini";
import businessesRouter from "./businesses";
import authRouter from "./auth";
import scenarioRouter from "./scenario";
import categoryRouter from "./category";
import transactionRouter from "./transaction";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API Running!" });
});

// Rutas de autenticación
router.use("/auth", authRouter);

// Otras rutas
router.use("/gemini", geminiRoutes);
router.use("/businesses", businessesRouter);
router.use("/scenario", scenarioRouter);
router.use("/transaction", transactionRouter);
router.use("/categories", categoryRouter);

export default router;