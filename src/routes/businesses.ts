import { Router } from "express";
import { BusinessesController } from "../controllers/businessesController";
import { BussinesValidator } from "../validators/businessValidator";

const businessesRouter = Router();
const bussines = new BusinessesController();

businessesRouter.get("/", bussines.getBussinesses);
businessesRouter.get("/user/:id", bussines.getBusinessByUser);
businessesRouter.post("/", BussinesValidator.createBussines(), bussines.createBusiness);
businessesRouter.put("/:id", BussinesValidator.updateBussines(), bussines.updateBusiness);
businessesRouter.delete("/:id", bussines.deleteBusiness);

export default businessesRouter;