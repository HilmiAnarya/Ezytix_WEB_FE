import React, { useState, useEffect } from "react";
import { Copy, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner"; // Pastikan sudah install sonner atau ganti alert biasa

interface Props {
  orderId: string;
  amount: number;
  expiryTime: string; // ISO String
  vaNumber: string;
  bankCode: string;
}

export const PaymentInfoCard: React.FC<Props> = ({ orderId, amount, expiryTime, vaNumber, bankCode }) => {
  const [timeLeft, setTimeLeft] = useState("");

  // Logic Hitung Mundur
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(expiryTime).getTime() - now;

      if (distance < 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}j ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  const handleCopy = () => {
    navigator.clipboard.writeText(vaNumber);
    toast.success("Nomor VA berhasil disalin!"); 
    // Jika tidak pakai sonner: alert("Nomor VA berhasil disalin!");
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 space-y-4">
        
        {/* Order ID */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order ID</span>
          </div>
          <p className="font-bold text-gray-900 text-lg tracking-wide font-mono">{orderId}</p>
        </div>

        {/* Detail Status */}
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded text-xs">Belum Dibayar</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Pembayaran</span>
            <span className="font-bold text-gray-900">{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3"/> Sisa Waktu</span>
            <span className="font-bold text-red-600 font-mono">{timeLeft}</span>
          </div>
        </div>

        {/* VA Section */}
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <span className="text-sm text-gray-500">Transfer ke</span>
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 px-3 py-2 rounded-md font-bold text-sm text-gray-700">
              {bankCode}
            </div>
            <span className="text-sm font-medium text-gray-900">{bankCode} Virtual Account</span>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between group hover:border-gray-300 transition-colors">
            <span className="font-mono text-xl font-bold tracking-widest text-gray-800">
              {vaNumber}
            </span>
            <button 
              onClick={handleCopy}
              className="p-2 hover:bg-white rounded-md transition-colors text-gray-400 hover:text-gray-600 hover:shadow-sm"
              title="Salin Nomor VA"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
      
      {/* Footer Info */}
      <div className="bg-blue-50 px-6 py-3 border-t border-blue-100 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 leading-relaxed">
            Pembayaran akan terverifikasi otomatis. Anda tidak perlu mengirim bukti transfer. Halaman ini akan refresh otomatis setelah pembayaran berhasil.
        </p>
      </div>
    </div>
  );
};