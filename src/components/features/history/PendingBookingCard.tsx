import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi"; // Hapus import yang tidak perlu
import { Booking } from "../../../types/booking";

interface Props {
  data: Booking;
}

export const PendingBookingCard: React.FC<Props> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  // --- HELPER FORMATTING ---
  // Mengambil kode bandara dari string "Jakarta (CGK)" -> "CGK"
  const getCode = (location: string) => {
    const match = location.match(/\(([^)]+)\)/);
    return match ? match[1] : location.substring(0, 3).toUpperCase();
  };

  // Helper untuk hitung sisa waktu (Sederhana)
  const getExpiryText = () => {
    if (!data.expiry_time) return "Segera lakukan pembayaran";
    const exp = new Date(data.expiry_time);
    return `Bayar sebelum ${exp.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      {/* BODY */}
      <div className="flex flex-col md:flex-row items-stretch">
        {/* LEFT CONTENT */}
        <div
          className="flex-1 flex items-center gap-5 p-5 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* LOGO */}
          <div className="w-14 h-14 flex-shrink-0 bg-white rounded-full border border-gray-100 flex items-center justify-center p-2 shadow-sm">
            <img
              src={data.flight.airline_logo}
              alt={data.flight.airline_name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* INFO */}
          <div className="flex flex-col">
            <div className="font-bold text-gray-900 text-base mb-1">
              {data.flight.origin ? getCode(data.flight.origin) : "JKT"} &gt; {data.flight.destination ? getCode(data.flight.destination) : "SIN"}
            </div>
            <div className="text-sm text-gray-900 mb-0.5">
              Booking ID: {data.booking_code}
            </div>
            <div className="text-xs text-gray-400">
              Dalam pemilihan metode pembayaran
            </div>
          </div>
        </div>

        {/* SEPARATOR */}
        <div className="hidden md:block w-[1px] bg-gray-100 self-stretch my-4"></div>

        {/* RIGHT ACTION - Same fixed width as Active card */}
        <div className="w-full md:w-[140px] flex items-center justify-center p-5">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-red-600 font-medium text-sm hover:underline whitespace-nowrap"
          >
            Lihat Detail
            <FiChevronDown
              className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="bg-gray-50 border-t border-gray-100 p-4 animate-in slide-in-from-top-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Selesaikan pembayaran untuk mendapatkan tiket.
            </span>
            <a
              href={data.payment_url}
              target="_blank"
              rel="noreferrer"
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition"
            >
              Bayar Sekarang
            </a>
          </div>
        </div>
      )}
    </div>
  );
};