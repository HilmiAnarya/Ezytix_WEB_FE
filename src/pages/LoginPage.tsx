/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import WhiteLogo from "../assets/images/ezywhite.png";
import LoginBG from "../assets/images/login-bg.jpg";

export default function LoginPage() {
    const { login, loading } = useAuth();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await login(identifier, password); 
            // ❗ Tidak perlu redirect manual → sudah di-handle di AuthContext
        } catch (err: any) {
            setError(
                err?.response?.data?.error ||
                "Login gagal. Periksa kembali data Anda."
            );
        }
    };

    return (
        <div
            className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center px-4"
            style={{
                backgroundImage: `url(${LoginBG})`, // ganti sesuai asetmu
            }}
        >
            {/* LOGO */}
            <div className="text-center mb-6">
                <img 
                    src={WhiteLogo}
                    alt="Ezytix Logo" 
                    className="w-48 mx-auto"
                />
                <p className="text-white tracking-wide mt-1 text-lg font-semibold">
                    CEPAT DAN AMAN
                </p>
            </div>

            {/* LOGIN CARD */}
            <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-xl p-8 w-full max-w-md">
                <h2 className="text-center text-xl font-semibold mb-4">Login</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Masukkan Email / No Handphone"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                        required
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan Password"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                        required
                    />

                    {/* ERROR MESSAGE */}
                    {error && (
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    )}

                    {/* LINKS */}
                    <div className="flex justify-between text-sm mt-2">
                        <Link to="/register" className="text-red-600 font-medium">
                            Belum Punya Akun?
                        </Link>
                        <span className="text-gray-400">Lupa Kata Sandi?</span>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition disabled:opacity-70"
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </button>
                </form>

                <p className="text-xs text-center text-gray-600 mt-4">
                    Dengan login, kamu menyetujui kebijakan Privasi dan Syarat & Ketentuan Ezytix.
                </p>
            </div>
        </div>
    );
}
