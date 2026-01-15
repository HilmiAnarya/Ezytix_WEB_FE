/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { FiUser, FiMail, FiPhone, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext"; // Pastikan path import sesuai

export const BookerInfoCard: React.FC = () => {
  const { user } = useAuth();

  // Jika user belum load/tidak ada, bisa return null atau loading skeleton
  // (Biasanya halaman ini diproteksi oleh PrivateRoute, jadi user pasti ada)
  if (!user) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-2">
      
      {/* Header Card */}
      <div className="bg-red-600 px-5 py-3 border-b border-red-700 flex justify-between items-center">
        <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
          Detail Pemesan
        </h3>
      </div>

      {/* Body Card */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Nama Lengkap */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <FiUser /> Nama Lengkap
          </label>
          <p className="font-bold text-gray-800 text-base truncate" title={user.full_name}>
            {user.full_name}
          </p>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <FiMail /> Email
          </label>
          <p className="font-bold text-gray-800 text-base truncate" title={user.email}>
            {user.email}
          </p>
        </div>

        {/* Nomor Telepon */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <FiPhone /> Nomor Telepon
          </label>
          <p className="font-bold text-gray-800 text-base">
            {user.phone || "-"}
          </p>
        </div>

      </div>

      {/* Footer Note */}
      <div className="bg-yellow-50 px-6 py-3 border-t border-yellow-100">
        <p className="text-xs text-yellow-700 font-medium">
          *E-ticket dan bukti pembayaran akan dikirim ke alamat email di atas.
        </p>
      </div>
    </div>
  );
};