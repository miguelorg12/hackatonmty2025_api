import { Router } from "express";
import geminiRoutes from "./gemini";
import businessesRouter from "./businesses";
import scenarioRouter from "./scenario";
import categoryRouter from "./category";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API Running!" });
});

router.use("/gemini", geminiRoutes);
router.use("/businesses", businessesRouter);
router.use("/scenario", scenarioRouter);
router.use("/categories", categoryRouter);

export default router;