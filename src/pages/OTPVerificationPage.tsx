/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// Sesuaikan path gambar jika berbeda
import beachBg from "../assets/images/login-bg.jpg";
import WhiteLogo from "../assets/images/ezywhite.png";
import RedLogo from "../assets/images/ezyred.png";

const OTP_LENGTH = 6;

const OTPVerificationPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { verifyOtp, resendOtp } = useAuth(); // Akan kita buat di Fase 5

    const emailFromUrl = searchParams.get("email");

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [cooldown, setCooldown] = useState(150); // Start dari 150 detik
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Jika tidak ada parameter email di URL, kembalikan ke login
    useEffect(() => {
        if (!emailFromUrl) {
            navigate("/login");
        }
    }, [emailFromUrl, navigate]);

    // --- HANDLERS UNTUK INPUT OTP (Persis dari kodemu) ---
    const handleChange = useCallback(
        (index: number, value: string) => {
            if (!/^\d*$/.test(value)) return;
            const digit = value.slice(-1);
            const newOtp = [...otp];
            newOtp[index] = digit;
            setOtp(newOtp);
            setError(null); // Clear error saat mulai ngetik lagi

            if (digit && index < OTP_LENGTH - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        },
        [otp]
    );

    const handleKeyDown = useCallback(
        (index: number, e: React.KeyboardEvent) => {
            if (e.key === "Backspace" && !otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        },
        [otp]
    );

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        const newOtp = Array(OTP_LENGTH).fill("");
        text.split("").forEach((ch, i) => (newOtp[i] = ch));
        setOtp(newOtp);
        setError(null);
        inputRefs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
    }, []);

    // --- API HANDLERS ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join("");

        if (otpCode.length < OTP_LENGTH) {
            setError("Silakan lengkapi 6 digit kode OTP.");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            // Panggil fungsi API Verifikasi
            await verifyOtp({ email: emailFromUrl!, otp_code: otpCode });
            // Redirect setelah sukses diurus oleh AuthContext
        } catch (err: any) {
            setError(err.message || "Kode OTP salah atau sudah kedaluwarsa.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        try {
            setLoading(true);
            setError(null);
            // Panggil fungsi API Resend
            await resendOtp(emailFromUrl!);
            setCooldown(150); // Reset timer 150 detik lagi
            alert("Kode OTP baru telah dikirim ke email Anda.");
        } catch (err: any) {
            setError(err.message || "Gagal mengirim ulang OTP.");
        } finally {
            setLoading(false);
        }
    };

    // --- TIMER EFFECT ---
    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    // Format Timer menjadi MM:SS
    const formatTime = (time: number) => {
        const m = Math.floor(time / 60);
        const s = time % 60;
        return `${m}:${s < 10 ? `0${s}` : s}`;
    };

    return (
        <div
            className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${beachBg})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-foreground/30" />

            <div className="relative z-10 flex w-full max-w-md flex-col items-center px-4">
                {/* Brand */}
                <img src={WhiteLogo} alt="Ezytix Logo" className="mb-2 h-10 object-contain drop-shadow-md" />
                
                {/* Subtitle (Putih Solid) */}
                <p className="mb-8 text-sm font-semibold uppercase tracking-[0.3em] text-white drop-shadow-sm">
                    Cepat dan Aman
                </p>

                {/* Card */}
                {/* Card - DIUBAH MENJADI bg-white */}
                <div className="w-full rounded-2xl bg-white p-8 shadow-2xl">
                    <h2 className="mb-2 text-center text-xl font-bold text-gray-900">
                        Masukan Kode OTP
                    </h2>
                    <p className="mb-6 text-center text-sm text-gray-500">
                        Masukan Kode yang dikirim via email ke:
                        <br />
                        <span className="font-semibold text-gray-900">{emailFromUrl}</span>
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 text-center text-sm font-medium text-red-600 bg-red-50 border border-red-200 py-2 px-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* OTP Inputs - DIUBAH MENJADI bg-white & border-gray-300 */}
                        <div className="mb-6 flex justify-center gap-3" onPaste={handlePaste}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => (inputRefs.current[i] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    disabled={loading}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    className="h-14 w-12 rounded-lg border-2 border-gray-300 bg-white text-center text-2xl font-bold text-gray-900 outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-200 disabled:bg-gray-100 disabled:opacity-50"
                                />
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || otp.join("").length < OTP_LENGTH}
                            className="mb-6 w-full rounded-lg bg-red-600 py-3 text-white font-bold shadow-md transition-all hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
                        >
                            {loading ? "Memverifikasi..." : "Verifikasi OTP"}
                        </button>
                    </form>

                    {/* Resend Button */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={cooldown > 0 || loading}
                            className="text-sm font-semibold text-red-600 transition-colors hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            {cooldown > 0 ? `Resend OTP (${formatTime(cooldown)})` : "Resend OTP"}
                        </button>
                    </div>

                    {/* Footer brand */}
                    <div className="mt-6 flex justify-center">
                        <img src={RedLogo} alt="Ezytix Logo" className="h-6 object-contain" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPVerificationPage;