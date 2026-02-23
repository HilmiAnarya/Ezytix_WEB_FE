/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { api } from "../lib/axios";
import { useNavigate, useLocation } from "react-router-dom";

export interface User {
    id: number;
    full_name: string;
    username: string;
    email: string;
    phone: string;
    role: "customer" | "admin";
    created_at: string;
    updated_at: string;
}

interface RegisterPayload {
    full_name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
}

interface VerifyOtpPayload {
    email: string;
    otp_code: string;
}

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (identifier: string, password: string) => Promise<void>;
    registerUser: (data: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
    verifyOtp: (data: VerifyOtpPayload) => Promise<void>;
    resendOtp: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const fetchUser = async () => {
        try {
            const res = await api.get("/auth/me", { withCredentials: true });
            setUser(res.data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (identifier: string, password: string) => {
        setLoading(true);
        try {
            const res = await api.post("/auth/login", {
                email: identifier.includes("@") ? identifier : undefined,
                phone: !identifier.includes("@") ? identifier : undefined,
                password,
            });

            setUser(res.data.user);

            const savedPath = sessionStorage.getItem("lastPath");
            if (savedPath) {
                sessionStorage.removeItem("lastPath");
                navigate(savedPath);
            } else {
                if (res.data.user.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            }
        } catch (err: any) {
            console.error("Login failed:", err);
            throw new Error(err.response?.data?.error || "Gagal melakukan login.");
        } finally {
            setLoading(false);
        }
    };

    const registerUser = async (data: RegisterPayload) => {
        setLoading(true);
        try {
            await api.post("/auth/register", data);
            navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        } catch (err: any) {
            console.error("Registration failed:", err);
            throw new Error(err.response?.data?.error || "Gagal mendaftarkan akun.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (data: VerifyOtpPayload) => {
        setLoading(true);
        try {
            const res = await api.post("/auth/verify-otp", data);
            setUser(res.data.user);
            const savedPath = sessionStorage.getItem("lastPath");
            if (savedPath) {
                sessionStorage.removeItem("lastPath");
                navigate(savedPath);
            } else {
                navigate("/");
            }
        } catch (err: any) {
            console.error("Verification failed:", err);
            throw new Error(err.response?.data?.error || "Kode OTP salah atau kedaluwarsa.");
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async (email: string) => {
        try {
            await api.post("/auth/resend-otp", { email });
        } catch (err: any) {
            console.error("Resend OTP failed:", err);
            throw new Error(err.response?.data?.error || "Gagal mengirim ulang OTP.");
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout", {}, { withCredentials: true });
        } catch (err) {
            console.warn("Logout failed:", err);
        } finally {
            setUser(null);
            navigate("/");
        }
    };

    useEffect(() => {
        if (!location.pathname.startsWith("/login") && !location.pathname.startsWith("/register") && !location.pathname.startsWith("/verify-otp")) {
            const fullPath = location.pathname + location.search;
            sessionStorage.setItem("lastPath", fullPath);
        }
    }, [location.pathname, location.search]);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                registerUser,
                logout,
                fetchUser,
                verifyOtp,
                resendOtp,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};