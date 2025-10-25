import { Request, Response } from "express";
import { ScenarioService } from "../services/scenarioService";
import { Scenario } from "../interface/scenario.interface";
import { validationResult } from "express-validator";

const scenarioService = new ScenarioService();

export class ScenarioController {
    public getScenarios = async (req: Request, res: Response): Promise<any> => {
        try{
            const scenarios: Scenario[] = await scenarioService.getAllScenarios();
            if(scenarios.length === 0){
                return res.status(404).json({ success: false, message : 'No scenarios found' });
            }
            return res.status(200).json({ success: true, data: scenarios });
        }catch(error){
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public getScenariosByBusinessId = async (req: Request, res: Response): Promise<any> => {
        try{
            const businessId = parseInt(req.params.businessId);
            const scenarios: Scenario[] = await scenarioService.getScenariosByBusinessId(businessId);
            if(scenarios.length === 0){
                return res.status(404).json({ success: false, message : 'No scenarios found for this business' });
            }
            return res.status(200).json({ success: true, data: scenarios });
        }catch(error){
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public createScenario = async (req: Request, res: Response): Promise<any> => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() });
            }
            const scenarioData: Scenario = req.body;
            const newScenario: Scenario = await scenarioService.createScenario(scenarioData);
            if(!newScenario){
                return res.status(400).json({
                    message: "Error creating scenario.",
                    success: false
                });
            }
            return res.status(201).json({ success: true, message: 'Scenario created successfully', data: newScenario });

        }catch(error){
            return res.status(500).json({ success: false, error: 'Failed to create scenario' });
        }
    }

    public updateScenario = async (req: Request, res: Response): Promise<any> => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()});
            }
            const id = req.params.id;
            const scenarioData: Scenario = req.body;
            var updatedScenario : Scenario = await scenarioService.getScenario(parseInt(id));
            if(!updatedScenario){
                return res.status(404).json({
                    message: "Scenario not found",
                    success: false
                });
            }
            updatedScenario = await scenarioService.updateScenario(parseInt(id), scenarioData);
            return res.status(200).json({
                success: true,
                message: 'Scenario updated successfully',
                data: updatedScenario
            });
        }catch(error){
            console.error('Error in updateScenario:', error);
            res.status(500).json({
                message: "Error updating scenario",
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    public deactivateScenario = async (req: Request, res: Response): Promise<any> => {
        try{
            const id = req.params.id;
            var deletedScenario : Scenario = await scenarioService.getScenario(parseInt(id));
            if(!deletedScenario){
                return res.status(404).json({
                    message: "Scenario not found",
                    success: false
                });
            }
            deletedScenario = await scenarioService.deactivateScenario(parseInt(id));
            return res.status(200).json({
                message: "Scenario deactivated successfully",
                success: true,
                data: deletedScenario
            });
        }catch(error){
            console.error('Error in deleteScenario:', error);
            return res.status(500).json({
                message: "Error deleting scenario",
                succes: false
            })
        }
    }
}