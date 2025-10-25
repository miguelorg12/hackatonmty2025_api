import { Router } from "express";
import { ScenarioController } from "../controllers/scenarioController";
import { ScenarioValidator } from "../validators/scenarioValidator";

const scenarioRouter = Router();
const scenario = new ScenarioController();

scenarioRouter.get("/", scenario.getScenarios);
scenarioRouter.get("/business/:businessId", scenario.getScenariosByBusinessId);
scenarioRouter.post("/", ScenarioValidator.createScenario(), scenario.createScenario);
scenarioRouter.put("/:id", ScenarioValidator.updateScenario(), scenario.updateScenario);
scenarioRouter.delete("/:id", scenario.deactivateScenario);

export default scenarioRouter;