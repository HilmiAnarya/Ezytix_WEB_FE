export interface User {
    id: number;
    full_name: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    created_at?: string;
    updated_at?: string;
}

export interface AccountInfo {
    fullName: string;
    username: string;
    email: string;
    phone: string;
}

export interface UpdateProfileRequest {
    full_name: string;
    username: string;
    email: string;
    phone: string;
}