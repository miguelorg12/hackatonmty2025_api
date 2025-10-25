import { Router } from "express";
import geminiRoutes from "./gemini";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API Running!" });
});

router.use("/gemini", geminiRoutes);

export default router;