import db from "../config/database";
import { Scenario } from "../interface/scenario.interface";

export class ScenarioService {

    public async getScenario(id: number): Promise<Scenario> {
        const result = await db.query('SELECT * FROM scenarios WHERE id = $1', [id]);
        return result.rows[0];
    }

    public async getAllScenarios(): Promise<Scenario[]> {
        const result = await db.query('SELECT * FROM scenarios');
        return result.rows;
    }

    public async getScenariosByBusinessId(business_id: number): Promise<Scenario[]> {
        const result = await db.query('SELECT * FROM scenarios WHERE business_id = $1', [business_id]);
        return result.rows;
    }

    public async createScenario(scenario: Scenario): Promise<Scenario> {
        const result = await db.query("INSERT INTO scenarios (business_id, name, income_multiplier, expense_multiplier, payment_delay_days, created_at, is_active) VALUES ($1, $2, $3, $4, $5, NOW(), true) RETURNING *", [scenario.business_id, scenario.name, scenario.income_multiplier, scenario.expense_multiplier, scenario.payment_delay_days]);
        return result.rows[0];
    }

    public async updateScenario(id: number, scenario: Scenario): Promise<Scenario> {
        const result = await db.query("UPDATE scenarios SET name = $1, income_multiplier = $2, expense_multiplier = $3, payment_delay_days = $4, updated_at = NOW() WHERE id = $5 RETURNING *", [scenario.name, scenario.income_multiplier, scenario.expense_multiplier, scenario.payment_delay_days, id]);
        return result.rows[0];  
    }

    public async deactivateScenario(id: number): Promise<Scenario> {
        const result = await db.query("UPDATE scenarios SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *", [id]);
        return result.rows[0];
    }

    public async createBulkScenarios(businessId: number, scenarios: any[]): Promise<Scenario[]> {
        const createdScenarios: Scenario[] = [];
        
        for (const scenario of scenarios) {
            const result = await db.query(
                `INSERT INTO scenarios (business_id, name, income_multiplier, expense_multiplier, payment_delay_days, created_at, is_active) 
                 VALUES ($1, $2, $3, $4, $5, NOW(), true) RETURNING *`,
                [
                    businessId,
                    scenario.name,
                    scenario.income_multiplier || 1.0,
                    scenario.expense_multiplier || 1.0,
                    scenario.payment_delay_days || 0
                ]
            );
            createdScenarios.push(result.rows[0]);
        }
        
        return createdScenarios;
    }
}