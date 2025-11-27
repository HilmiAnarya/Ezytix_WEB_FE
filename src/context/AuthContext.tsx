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

// =======================
// User type dari backend
// =======================

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
    email?: string;
    phone: string;
    password: string;
}

// =======================
// AUTH CONTEXT TYPE
// =======================

interface AuthContextValue {
    user: User | null;
    loading: boolean;

    login: (identifier: string, password: string) => Promise<void>;
    registerUser: (data: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ====================================================
// PROVIDER
// ====================================================

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    // ========================
    // FETCH USER FROM COOKIE
    // ========================
    const fetchUser = async () => {
        try {
            const res = await api.get<User>("/auth/me", { withCredentials: true });
            setUser(res.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // ========================
    // LOGIN
    // ========================
    const login = async (identifier: string, password: string) => {
        setLoading(true);

        try {
            await api.post(
                "/auth/login",
                { email: identifier, phone: identifier, password },
                { withCredentials: true }
            );

            const res = await api.get<User>("/auth/me", { withCredentials: true });
            const loggedInUser = res.data;

            setUser(loggedInUser);

            // Redirect berdasarkan role
            if (loggedInUser.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                const last = sessionStorage.getItem("lastPath") || "/";
                navigate(last);
            }
        } catch (err) {
            console.error("Login failed:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ========================
    // REGISTER
    // ========================
    const registerUser = async (data: RegisterPayload) => {
        setLoading(true);

        try {
            await api.post("/auth/register", data, {
                withCredentials: true,
            });

            navigate("/login");
        } catch (err) {
            console.error("Register failed:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ========================
    // LOGOUT
    // ========================
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

    // ========================
    // SAVE LAST PATH
    // ========================
    useEffect(() => {
        if (!location.pathname.startsWith("/login") && !location.pathname.startsWith("/register")) {
            sessionStorage.setItem("lastPath", location.pathname);
        }
    }, [location.pathname]);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                registerUser,
                logout,
                fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// =======================
// HOOK
// =======================
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
