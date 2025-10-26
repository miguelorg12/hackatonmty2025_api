export interface Transaction {
    id?: number;
    business_id: number;
    category_id: number;
    amount: number;
    description?: string;
    date: Date;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
}