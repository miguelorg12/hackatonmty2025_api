import { Router } from "express";
import { BusinessesController } from "../controllers/businessesController";
import { BussinesValidator } from "../validators/businessValidator";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const businessesRouter = Router();
const bussines = new BusinessesController();

// Rutas públicas
businessesRouter.get("/",AuthMiddleware.verifyToken, bussines.getBussinesses);

// Rutas protegidas
businessesRouter.get("/user/:id", AuthMiddleware.verifyToken, bussines.getBusinessByUser);
businessesRouter.post("/", 
    AuthMiddleware.verifyToken, 
    BussinesValidator.createBussines(), 
    bussines.createBusiness
);
businessesRouter.put("/:id", 
    AuthMiddleware.verifyToken, 
    BussinesValidator.updateBussines(), 
    bussines.updateBusiness
);
businessesRouter.delete("/:id", AuthMiddleware.verifyToken, bussines.deleteBusiness);

export default businessesRouter;