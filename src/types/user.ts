// src/types/user.ts

// Tipe data sesuai dengan response dari Backend (models.User)
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

// Tipe data untuk form di UI (Mengekstrak dari AccountInfo bawaanmu)
export interface AccountInfo {
    fullName: string;
    username: string;
    email: string;
    phone: string;
}

// Tipe data untuk payload request saat update profile
export interface UpdateProfileRequest {
    full_name: string;
    username: string;
    email: string;
    phone: string;
}