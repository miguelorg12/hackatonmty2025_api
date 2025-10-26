export interface Scenario {
    id?: number;
    business_id?: number;
    name?: string;
    income_multiplier?: number;
    expense_multiplier?: number;
    payment_delay_days?: number;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
}