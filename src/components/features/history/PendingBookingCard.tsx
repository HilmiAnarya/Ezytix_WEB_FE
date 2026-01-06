/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { FiChevronDown, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { Booking } from "../../../types/booking";

interface Props {
  data: Booking;
}

export const PendingBookingCard: React.FC<Props> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  // --- HELPER FORMATTING ---
  const getCode = (location: string) => {
    const match = location.match(/\(([^)]+)\)/);
    return match ? match[1] : location.substring(0, 3).toUpperCase();
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden shadow-sm transition-shadow hover:shadow-md">

      {/* 2. BODY CARD */}
      <div className="p-5 flex items-center justify-between">
            
            {/* KIRI: Logo */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex-shrink-0 border border-gray-100 rounded-full flex items-center justify-center bg-white p-2 shadow-sm">
                    <img 
                      src={data.flight.airline_logo} 
                      alt={data.flight.airline_name} 
                      className="w-full h-full object-contain"
                    />
                </div>

                {/* INFO TENGAH */}
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

            {/* KANAN: Lihat Detail */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-red-600 text-xs font-bold hover:underline focus:outline-none"
            >
                Lihat Detail
            </button>
      </div>

      {/* 3. DROPDOWN (OPTIONAL DETAIL) */}
      {isOpen && (
          <div className="bg-gray-50 border-t border-gray-100 p-4 animate-in slide-in-from-top-1">
              <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Selesaikan pembayaran untuk mendapatkan tiket.</span>
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
