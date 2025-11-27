// src/pages/ProfilePage.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import AdminNavbar from "../components/layout/AdminNavbar";

const ProfilePage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            <AdminNavbar />

            <main className="flex-1 flex flex-col items-center justify-start pt-16">
                <h1 className="text-lg font-medium text-gray-800 mt-6">
                    {user ? `Welcome ${user.full_name}` : "Welcome User"}
                </h1>

            </main>
        </div>
    );
};

export default ProfilePage;
