import db from "../config/database";
import { Business } from "../interface/businesse.interface";

export class BusinessesService {
    public async getBusiness(id: number): Promise<Business> {
        const result = await db.query('SELECT * FROM businesses WHERE id = $1', [id]);
        return result.rows[0];
    }

    public async getBusinessByUserId(user_id: number): Promise<Business[]> {
        const result = await db.query('SELECT * FROM businesses WHERE user_id = $1', [user_id]);
        return result.rows;
    }

    public async getAllBusinesses(): Promise<Business[]> {
        const result = await db.query('SELECT * FROM businesses');
        return result.rows;
    }
    
    public async createBusiness(business: Business): Promise<Business> {
        const result = await db.query("INSERT INTO businesses (enterprise_name, business_type, initial_balance, created_at, is_active, user_id) VALUES ($1, $2, $3, NOW(), true, $4) RETURNING *", [business.enterprise_name, business.business_type, business.initial_balance, business.user_id]);
        return result.rows[0];
    }

    public async updateBusiness(id: number, business: Business): Promise<Business> {
        const result = await db.query("UPDATE businesses SET enterprise_name = $1, business_type = $2, initial_balance = $3, updated_at = NOW() WHERE id = $4 RETURNING *", [business.enterprise_name, business.business_type, business.initial_balance, id]);
        return result.rows[0];  
    }

    public async deactivateBusiness(id: number): Promise<Business> {
        const result = await db.query("UPDATE businesses SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *", [id]);
        return result.rows[0];
    }
    

}