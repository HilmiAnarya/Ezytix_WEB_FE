import React, { useMemo, useState } from "react";
import { FiChevronDown, FiClock, FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Booking } from "../../../types/booking";
import { useBookingTimer } from "../../../hooks/useBookingTimer";
import { formatCurrency } from "../../../utils/formatters";

interface Props {
  data: Booking;
}

export const PendingBookingCard: React.FC<Props> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const expiryTimestamp = useMemo(() => {
    return data.expiry_time || null; 
  }, [data.expiry_time]);

  const safeExpiry = expiryTimestamp || new Date(0).toISOString();
  
  const { hours, minutes, seconds, isExpired } = useBookingTimer(safeExpiry);

  const showTimer = !!expiryTimestamp && !isExpired;

  const getCode = (location: string) => {
    if (!location) return "UNK";
    const match = location.match(/\(([^)]+)\)/);
    return match ? match[1] : location.substring(0, 3).toUpperCase();
  };

  const handlePayNow = () => {
    navigate(`/payment/${data.order_id}/select`); 
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden shadow-sm transition-shadow hover:shadow-md">
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
          <div className="flex flex-col">
            <div className="font-bold text-gray-900 text-base mb-1">
              {getCode(data.flight.origin)} &gt; {getCode(data.flight.destination)}
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-1">
              <span>Booking ID: <span className="font-mono text-gray-700">{data.booking_code}</span></span>
            </div>
            <div className="flex items-center gap-2">
                {showTimer ? (
                    <span className="text-xs font-medium text-orange-600 flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded">
                        <FiClock className="w-3 h-3" />
                        Bayar dalam {hours}j {minutes}m {seconds}d
                    </span>
                ) : (
                    <span className="text-xs font-bold text-red-600 bg-red-50 flex items-center gap-1 px-2 py-0.5 rounded">
                        <FiAlertCircle className="w-3 h-3" />
                        {data.status === 'expired' ? 'Expired' : 'Segera Bayar'}
                    </span>
                )}
            </div>
          </div>
        </div>
        <div className="hidden md:block w-[1px] bg-gray-100 self-stretch my-4"></div>
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
      {isOpen && (
        <div className="bg-gray-50 border-t border-gray-100 p-5 animate-in slide-in-from-top-1">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            <div className="text-sm text-gray-600">
              <p>Total Tagihan: <span className="font-bold text-gray-900">{formatCurrency(data.total_amount)}</span></p>
              <p className="text-xs mt-1 text-gray-500">Selesaikan pembayaran untuk menerbitkan E-Tiket Anda.</p>
            </div>
            {showTimer ? (
                <button
                    onClick={handlePayNow}
                    className="w-full md:w-auto bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-red-700 transition shadow-sm"
                >
                    Bayar Sekarang
                </button>
            ) : (
                <button
                    disabled
                    className="w-full md:w-auto bg-gray-300 text-gray-500 px-6 py-2.5 rounded-lg font-bold text-sm cursor-not-allowed flex items-center gap-2 justify-center"
                >
                    <FiAlertCircle />
                    {data.status === 'expired' ? 'Waktu Habis' : 'Cek Status'}
                </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};