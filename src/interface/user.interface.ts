export interface User {
    id ?: number,
    username : string,
    email : string,
    password : string,
    created_at ?: Date,
    updated_at ?: Date
    is_active ?: boolean
}

export interface Login {
    email : string,
    password : string
}

export interface Register {
    username : string,
    email : string,
    password : string
}