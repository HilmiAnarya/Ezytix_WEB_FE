/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Context & Services
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";

// Types
import { AccountInfo } from "../types/user";

// Components
import { ProfileSidebar, MenuKey } from "../components/features/profile/ProfileSidebar";
import { AccountInfoForm } from "../components/features/profile/AccountInfoForm";
import { ETicketPanel } from "../components/features/profile/ETicketPanel";
import { HistoryNavbar } from "../components/layout/HistoryNavbar";

const ProfilePage: React.FC = () => {
    const { user, logout, fetchUser } = useAuth();
    const navigate = useNavigate();

    // State Navigasi Sidebar
    const [activeMenu, setActiveMenu] = useState<MenuKey>("informasi-akun");
    
    // State Loading untuk Form
    const [isUpdating, setIsUpdating] = useState(false);

    // Mengubah data user dari backend (snake_case) menjadi AccountInfo untuk form (camelCase)
    const accountData: AccountInfo = useMemo(() => {
        return {
            fullName: user?.full_name || "",
            username: user?.username || "",
            email: user?.email || "",
            phone: user?.phone || "",
        };
    }, [user]);

    // Handler untuk Update Profil
    const handleSave = async (data: AccountInfo) => {
        setIsUpdating(true);
        try {
            // 1. Tembak API Update melalui userService
            await userService.updateProfile({
                full_name: data.fullName,
                username: data.username,
                email: data.email,
                phone: data.phone,
            });

            // 2. Fetch ulang data user agar state global AuthContext terupdate
            await fetchUser();

            // 3. Notifikasi Sukses
            alert("Informasi akun kamu telah diperbarui.");
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.error || "Gagal memperbarui profil.");
        } finally {
            setIsUpdating(false);
        }
    };

    // Handler untuk Logout
    const handleLogout = async () => {
        if (window.confirm("Apakah kamu yakin ingin keluar?")) {
            await logout(); // Memanggil fungsi logout bawaan AuthContext
            // Navigasi ke home atau login di-handle oleh context
        }
    };

    // Render pengaman (Jika user masih null karena belum selesai di-fetch)
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
                <p className="text-gray-500 font-medium animate-pulse">Memuat data profil...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            <HistoryNavbar />

            <main className="flex-1 p-4 md:p-8 pt-24 md:pt-28">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 items-start">
                    
                    {/* SIDEBAR COMPONENT */}
                    <ProfileSidebar
                        userName={user.full_name}
                        username={user.username}
                        activeMenu={activeMenu}
                        onMenuChange={setActiveMenu}
                        onLogout={handleLogout}
                    />

                    {/* MAIN CONTENT AREA */}
                    {activeMenu === "informasi-akun" ? (
                        <AccountInfoForm
                            initialData={accountData}
                            onSave={handleSave}
                            isLoading={isUpdating}
                        />
                    ) : (
                        <ETicketPanel
                            onNavigateToRiwayat={() => navigate("/history")} // Sesuaikan path riwayatmu
                        />
                    )}

                </div>
            </main>
        </div>
    );
};

export default ProfilePage;