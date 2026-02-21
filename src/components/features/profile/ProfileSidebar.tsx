import React from "react";
import { User, Ticket, LogOut } from "lucide-react";

export type MenuKey = "informasi-akun" | "e-tiket-aktif";

interface ProfileSidebarProps {
    userName: string;
    username: string;
    activeMenu: MenuKey;
    onMenuChange: (menu: MenuKey) => void;
    onLogout: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
    userName,
    username,
    activeMenu,
    onMenuChange,
    onLogout,
}) => {
    // Logic untuk mengambil inisial nama (Misal: "Anton Maraton" -> "AM")
    const initials = userName
        ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    const menuItems: { key: MenuKey; label: string; icon: React.ReactNode }[] = [
        { key: "informasi-akun", label: "Informasi akun", icon: <User className="h-4 w-4" /> },
        { key: "e-tiket-aktif", label: "E-tiket aktif", icon: <Ticket className="h-4 w-4" /> },
    ];

    return (
        <aside className="bg-white rounded-xl border border-gray-200 p-6 w-72 shrink-0 h-fit shadow-sm">
            {/* Profile header (Pengganti Komponen Avatar) */}
            <div className="flex items-center gap-3 mb-6">
                <div className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-full">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold">
                        {initials}
                    </div>
                </div>
                <div>
                    <p className="font-bold text-gray-900 text-base leading-tight">{userName}</p>
                    <p className="text-sm text-gray-500">@{username}</p>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 mb-4" />

            {/* Menu items */}
            <nav className="flex flex-col gap-1">
                {menuItems.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => onMenuChange(item.key)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                            activeMenu === item.key
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        <span className={activeMenu === item.key ? "text-blue-600" : "text-gray-500"}>
                            {item.icon}
                        </span>
                        {item.label}
                    </button>
                ))}

                <button
                    onClick={onLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left mt-1"
                >
                    <span className="text-red-500">
                        <LogOut className="h-4 w-4" />
                    </span>
                    Logout
                </button>
            </nav>
        </aside>
    );
};