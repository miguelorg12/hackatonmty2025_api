import { Request, Response } from "express";
import { BusinessesService } from "../services/businessesService";
import { Business } from "../interface/businesse.interface";
import { validationResult } from "express-validator";

const business_Service = new BusinessesService();

export class BusinessesController {
    public getBussinesses = async (req: Request, res: Response): Promise<any> => {
        try {
            const businesses: Business[] = await business_Service.getAllBusinesses();
            if(businesses.length === 0){
                return res.status(404).json({ success: false, message : 'No businesses found' });
            }
            return res.status(200).json({ success: true, data: businesses });
        } catch (error) {
            return res.status(500).json({ success: false, error: 'Failed to retrieve businesses' });
        }
    }

    public getBusinessByUser = async (req: Request, res: Response): Promise<any> => {
        try{
            const businesses : Business[] = await business_Service.getBusinessByUserId(parseInt(req.params.id));
            if(businesses.length === 0){
                return res.status(404).json({ success: false, message : 'No businesses found for this user' });
            }
            return res.status(200).json({ success: true, data: businesses });
        }catch(error){

        }
    }

    public createBusiness = async (req: Request, res: Response): Promise<any> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() });
            }
            const businessData: Business = req.body;
            const newBusiness: Business = await business_Service.createBusiness(businessData);
            if(!newBusiness)
            {
                return res.status(400).json({
                    message: "Error creating business.",
                    success: false
                });
                
            }
            return res.status(201).json({ 
                success: true, 
                message: 'Business created successfully', 
                data: newBusiness });
        } catch (error) {
            return res.status(500).json({ success: false, error: 'Failed to create business' });
        }
    }

    public updateBusiness = async (req: Request, res: Response): Promise<any> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()});
            }
            const id = req.params.id;
            const businessData: Business = req.body;
            var updatedBusiness : Business = await business_Service.getBusiness(parseInt(id));
            if(!updatedBusiness){
                return res.status(404).json({
                    message: "Business not found",
                    success: false
                });
            }
            updatedBusiness = await business_Service.updateBusiness(parseInt(id), businessData);
            return res.status(200).json({
                message: "Business updated successfully",
                success: true,
                data: updatedBusiness
            });
        }catch(error){
            console.error('Error in updateBusiness:', error);
            res.status(500).json({
                message: "Error updating business",
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    public deleteBusiness = async (req: Request, res: Response): Promise<any> => {
        try {
            const id = req.params.id;
            var deletedBusiness: Business = await business_Service.getBusiness(parseInt(id));
            if(!deletedBusiness){
                return res.status(404).json({
                    message: "Business not found",
                    success: false
                });
            }
            deletedBusiness = await business_Service.deactivateBusiness(parseInt(id));
            return res.status(200).json({
                message: "Business deactivated successfully",
                success: true,
                data: deletedBusiness
            });
        }catch(error){
            console.error('Error in deleteBusiness:', error);
            return res.status(500).json({
                message: "Error deleting business",
                succes: false
            })
        }
    }

}