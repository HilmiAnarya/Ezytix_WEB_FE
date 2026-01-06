/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { FiChevronDown, FiDownload, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { Booking } from "../../../types/booking";

interface Props {
  data: Booking;
}

export const ActiveBookingCard: React.FC<Props> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  // --- HELPER FORMATTING ---
  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "2-digit",
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

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-4 overflow-hidden transition-all duration-300 hover:shadow-md">

        {/* === HEADER CARD (Figma Frame 90 Style - Adapted Responsively) === */}
        <div className="p-0">
            <div className="flex flex-col md:flex-row items-center">
                
                {/* LEFT CONTENT WRAPPER */}
                <div 
                    className="flex-1 flex items-center gap-5 p-5 cursor-pointer w-full"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {/* LOGO (Circle) */}
                    <div className="w-14 h-14 flex-shrink-0 bg-white rounded-full border border-gray-100 flex items-center justify-center p-2 shadow-sm">
                         <img
                            src={data.flight.airline_logo}
                            alt={data.flight.airline_name}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* INFO GRID */}
                    <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        
                        {/* 1. MASKAPAI & KEBERANGKATAN */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900 text-base md:text-lg">
                                    {data.flight.airline_name}
                                </span>
                                <span className="font-light text-gray-300">|</span>
                                <span className="font-medium text-gray-900 text-base md:text-lg">
                                    {data.flight.flight_code}
                                </span>
                            </div>
                            <div className="relative h-[40px] w-[100px]">
                                <p className="absolute top-0 left-0 text-[15px] font-medium text-gray-900 leading-none">
                                    {formatTime(data.flight.departure_time)}
                                </p>
                                <p className="absolute top-[18px] left-0 text-[10px] font-medium text-gray-500 leading-none whitespace-nowrap">
                                    {formatDate(data.flight.departure_time)}
                                </p>
                                <p className="absolute top-[30px] left-0 text-[10px] font-medium text-gray-500 leading-none">
                                    {getCode(data.flight.origin)}
                                </p>
                            </div>
                        </div>

                        {/* 2. DURASI */}
                        <div className="flex flex-col items-center pt-1 md:pt-5">
                            <span className="text-[11px] font-medium text-gray-900 mb-0.5">{formatDuration(data.flight.duration_minutes)}</span>
                            <span className="text-[10px] text-gray-500">Langsung</span>
                        </div>

                        {/* 3. KEDATANGAN */}
                        <div className="relative h-[40px] w-[100px] hidden md:block mt-6">
                            <p className="absolute top-0 right-0 text-[15px] font-medium text-gray-900 leading-none text-right">
                                {formatTime(data.flight.arrival_time)}
                            </p>
                            <p className="absolute top-[18px] right-0 text-[10px] font-medium text-gray-500 leading-none text-right whitespace-nowrap w-full">
                                {formatDate(data.flight.arrival_time)}
                            </p>
                            <p className="absolute top-[30px] right-0 text-[10px] font-medium text-gray-500 leading-none text-right">
                                {getCode(data.flight.destination)}
                            </p>
                        </div>
                         {/* Mobile View Arrival */}
                        <div className="flex flex-col md:hidden items-end">
                             <p className="text-[15px] font-bold text-gray-900">{formatTime(data.flight.arrival_time)}</p>
                             <p className="text-[10px] text-gray-500">{formatDate(data.flight.arrival_time)}</p>
                             <p className="text-[10px] text-gray-500">{getCode(data.flight.destination)}</p>
                        </div>

                    </div>
                </div>

                {/* SEPARATOR (Vertical Line) */}
                <div className="hidden md:block w-[1px] bg-gray-100 self-stretch my-4"></div>

                {/* RIGHT ACTION SECTION (Button) */}
                <div className="w-full md:w-auto h-full flex flex-col justify-center p-5 md:p-6 min-w-[140px]">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-center gap-1 text-red-600 font-medium text-sm hover:underline whitespace-nowrap w-full"
                    >
                        Lihat Detail
                        <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

            </div>
        </div>

        {/* === DROPDOWN CONTENT === */}
        {isOpen && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 animate-in slide-in-from-top-1">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Kode Booking: <span className="font-mono font-bold text-gray-900">{data.booking_code}</span>
                    </div>
                    <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition flex items-center gap-2">
                        <FiDownload /> Download Tiket
                    </button>
                </div>
            </div>
        )}

    </div>
  );
};
 