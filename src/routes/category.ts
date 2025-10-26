import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import { CategoryValidator } from "../validators/categoryValidator";

const categoryRouter = Router();
const category = new CategoryController();

categoryRouter.get("/", category.getCategories);
categoryRouter.get("/business/:businessId", category.getCategoriesByBusinessId);
categoryRouter.post("/", CategoryValidator.createCategory(), category.createCategory);
categoryRouter.put("/:id", CategoryValidator.updateCategory(), category.updateCategory);
categoryRouter.delete("/:id", category.deactivateCategory);

export default categoryRouter;
