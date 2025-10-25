import { Router } from "express";
import geminiRoutes from "./gemini";
import businessesRouter from "./businesses";
const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API Running!" });
});

router.use("/gemini", geminiRoutes);
router.use("/businesses", businessesRouter);
export default router;