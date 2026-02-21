/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { AccountInfo } from "../../../types/user";

interface AccountInfoFormProps {
    initialData: AccountInfo;
    onSave: (data: AccountInfo) => void;
    isLoading?: boolean; // Tambahan prop untuk state loading dari API
}

export const AccountInfoForm: React.FC<AccountInfoFormProps> = ({ initialData, onSave, isLoading = false }) => {
    const [formData, setFormData] = useState<AccountInfo>(initialData);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        // Cek apakah ada perubahan data
        const changed =
            formData.fullName !== initialData.fullName ||
            formData.username !== initialData.username ||
            formData.email !== initialData.email ||
            formData.phone !== initialData.phone;
        setHasChanges(changed);
    }, [formData, initialData]);

    const handleChange = (field: keyof AccountInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSave = () => {
        onSave(formData);
        // State hasChanges akan otomatis reset jika initialData dari parent terupdate
    };

    // Class Tailwind untuk Input bergaya Shadcn
    const inputClassName = "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors";
    
    // Class Tailwind untuk Label bergaya Shadcn
    const labelClassName = "text-xs font-semibold text-gray-600 mb-1.5";

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-8 flex-1 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Informasi akun</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <div className="flex flex-col">
                    <label htmlFor="fullName" className={labelClassName}>Nama Lengkap</label>
                    <input id="fullName" value={formData.fullName} onChange={handleChange("fullName")} className={inputClassName} disabled={isLoading} />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="username" className={labelClassName}>Username</label>
                    <input id="username" value={formData.username} onChange={handleChange("username")} className={inputClassName} disabled={isLoading} />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="email" className={labelClassName}>Email</label>
                    <input id="email" type="email" value={formData.email} onChange={handleChange("email")} className={inputClassName} disabled={isLoading} />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="phone" className={labelClassName}>Nomor Telepon</label>
                    <input id="phone" type="tel" value={formData.phone} onChange={handleChange("phone")} className={inputClassName} disabled={isLoading} />
                </div>
            </div>

            <div className="mb-6 space-y-1">
                <p className="text-xs text-gray-500 leading-relaxed">
                    1. Masukkan email dan nomor telepon yang aktif. Karena invoice dan e-tiket akan dikirim melalui email.
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                    2. Jika ingin mengganti password, silakan keluar terlebih dahulu dan gunakan fitur Lupa Password (jika tersedia).
                </p>
            </div>

            <div className="flex justify-end">
                {/* Pengganti Komponen Button Shadcn */}
                <button
                    onClick={handleSave}
                    disabled={!hasChanges || isLoading}
                    className={`inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors px-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                        hasChanges && !isLoading
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    {isLoading ? "Menyimpan..." : "Simpan"}
                </button>
            </div>
        </div>
    );
};