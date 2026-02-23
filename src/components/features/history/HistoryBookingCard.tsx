import React, { useState } from "react";
import { FiChevronDown, FiXCircle, FiCheckCircle } from "react-icons/fi";
import { Booking } from "../../../types/booking";

interface Props {
    data: Booking;
}

export const HistoryBookingCard: React.FC<Props> = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(parseFloat(amount));
    };

    const formatTime = (isoString: string) => {
        if (!isoString) return "";
        return new Date(isoString).toLocaleTimeString("id-ID", {
            hour: "2-digit", minute: "2-digit", hour12: false,
        });
    };

    const formatDate = (isoString: string) => {
        if (!isoString) return "";
        return new Date(isoString).toLocaleDateString("id-ID", {
            day: "numeric", month: "short", year: "numeric",
        });
    };

    const formatDuration = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}j ${m}m`;
    };

    const getCode = (location: string) => {
        const match = location.match(/\(([^)]+)\)/);
        return match ? match[1] : location.substring(0, 3).toUpperCase();
    };

    const isExpired = data.status === 'expired';
    
    return (
    <div
      className={`bg-white border border-gray-200 rounded-xl shadow-sm mb-4 overflow-hidden transition-all duration-300 ${isOpen ? "shadow-md border-gray-300" : "hover:shadow-md"}`}
    >
      <div className="flex flex-col md:flex-row items-stretch">
        <div
          className="flex-1 flex items-center gap-5 p-5 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-14 h-14 flex-shrink-0 bg-white rounded-full border border-gray-100 flex items-center justify-center p-2 shadow-sm">
            <img
              src={data.flight.airline_logo}
              alt={data.flight.airline_name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-900 text-[15px]">
                  {data.flight.airline_name}
                </span>
                <span className="text-gray-300">|</span>
                <span className="font-medium text-gray-900 text-[15px]">
                  {data.flight.flight_code}
                </span>
              </div>
              <p className="text-[15px] font-medium text-gray-900">
                {formatTime(data.flight.departure_time)}
              </p>
              <p className="text-[11px] text-gray-500">
                {formatDate(data.flight.departure_time)}
              </p>
              <p className="text-[11px] text-gray-500">
                {getCode(data.flight.origin)}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center pt-6">
              <p className="text-[13px] font-medium text-gray-900">
                {formatDuration(data.flight.duration_minutes)}
              </p>
              <p className="text-[11px] text-gray-500">Langsung</p>
            </div>
            <div className="flex flex-col items-end pt-6">
              <p className="text-[15px] font-medium text-gray-900">
                {formatTime(data.flight.arrival_time)}
              </p>
              <p className="text-[11px] text-gray-500">
                {formatDate(data.flight.arrival_time)}
              </p>
              <p className="text-[11px] text-gray-500">
                {getCode(data.flight.destination)}
              </p>
            </div>
          </div>
        </div>
        <div className="hidden md:block w-[1px] bg-gray-100 self-stretch my-4"></div>
        <div className="w-full md:w-[140px] flex flex-col items-center justify-center p-5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            {data.flight.seat_class || "ECONOMY"} | {data.flight.class_code || "M9"}
          </p>
          <p className="text-[12px] font-bold text-gray-400">TOTAL</p>
          <div className="flex items-baseline gap-1">
            <span className="text-red-500 font-bold text-sm">IDR</span>
            <span className="text-red-500 font-bold text-base">
              {formatCurrency(data.total_amount).replace("Rp", "").trim()}
            </span>
          </div>
          
        </div>
      </div>
      <div
        className="bg-white px-6 py-3 border-t border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="text-[11px] font-medium text-gray-900">
          Kode Booking:{" "}
          <span className="font-mono font-bold ml-1">{data.booking_code}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 select-none">
          <span>{isOpen ? "Tutup Detail" : "Lihat Keterangan"}</span>
          <FiChevronDown
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>
      {isOpen && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 animate-in slide-in-from-top-1">
          <div className="flex flex-col gap-2">
            {isExpired ? (
              <div className="flex items-start gap-2 text-xs text-gray-500">
                <FiCheckCircle className="mt-0.5 text-gray-400" />
                <p>
                  Penerbangan ini telah selesai atau masa berlaku tiket sudah
                  habis.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-xs text-red-500">
                <FiXCircle className="mt-0.5" />
                <p>
                  Pemesanan dibatalkan oleh sistem karena batas waktu pembayaran
                  habis atau dibatalkan oleh pengguna.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};