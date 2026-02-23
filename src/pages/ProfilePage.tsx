/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";
import { AccountInfo } from "../types/user";
import { ProfileSidebar, MenuKey } from "../components/features/profile/ProfileSidebar";
import { AccountInfoForm } from "../components/features/profile/AccountInfoForm";
import { ETicketPanel } from "../components/features/profile/ETicketPanel";
import { HistoryNavbar } from "../components/layout/HistoryNavbar";

const ProfilePage: React.FC = () => {
    const { user, logout, fetchUser } = useAuth();
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState<MenuKey>("informasi-akun");
    const [isUpdating, setIsUpdating] = useState(false);
    const accountData: AccountInfo = useMemo(() => {
        return {
            fullName: user?.full_name || "",
            username: user?.username || "",
            email: user?.email || "",
            phone: user?.phone || "",
        };
    }, [user]);

    const handleSave = async (data: AccountInfo) => {
        setIsUpdating(true);
        try {
            await userService.updateProfile({
                full_name: data.fullName,
                username: data.username,
                email: data.email,
                phone: data.phone,
            });
            await fetchUser();
            alert("Informasi akun kamu telah diperbarui.");
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.error || "Gagal memperbarui profil.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = async () => {
        if (window.confirm("Apakah kamu yakin ingin keluar?")) {
            await logout();
        }
    };

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
                    <ProfileSidebar
                        userName={user.full_name}
                        username={user.username}
                        activeMenu={activeMenu}
                        onMenuChange={setActiveMenu}
                        onLogout={handleLogout}
                    />

                    {activeMenu === "informasi-akun" ? (
                        <AccountInfoForm
                            initialData={accountData}
                            onSave={handleSave}
                            isLoading={isUpdating}
                        />
                    ) : (
                        <ETicketPanel
                            onNavigateToRiwayat={() => navigate("/history")}
                        />
                    )}

                </div>
            </main>
        </div>
    );
};

export default ProfilePage;