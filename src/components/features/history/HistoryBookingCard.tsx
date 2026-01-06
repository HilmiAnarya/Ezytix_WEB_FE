/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { FiChevronDown, FiArrowRight, FiCheckCircle, FiXCircle, FiDownload } from "react-icons/fi";
import { Booking } from "../../../types/booking";

interface Props {
    data: Booking;
}

export const HistoryBookingCard: React.FC<Props> = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);

    // --- HELPER FORMATTING ---
    const formatRupiah = (amount: string) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(amount));
    };

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

    // Logic Status untuk Dropdown
    const isCancelled = data.status === 'cancelled' || data.status === 'failed';
    // const isSuccess = data.status === 'paid' || data.status === 'issued'; // Asumsi status sukses

    return (
        <div className={`bg-white border border-gray-200 rounded-xl shadow-sm mb-4 overflow-hidden transition-all duration-300 ${isOpen ? "shadow-md border-red-100" : "hover:shadow-md"}`}>

            {/* === HEADER CARD === */}
            <div 
                className={`p-6 relative flex flex-col md:flex-row gap-6 items-stretch ${isCancelled ? "cursor-pointer" : ""}`}
                onClick={() => isCancelled && setIsOpen(!isOpen)}
            >

                {/* KIRI: Logo & Info Penerbangan */}
                <div className="flex-1 flex gap-5 items-center">
                    
                    {/* LOGO */}
                    <div className="w-14 h-14 flex-shrink-0 bg-white rounded-full border border-gray-100 flex items-center justify-center p-2 shadow-sm">
                        <img
                            src={data.flight.airline_logo}
                            alt={data.flight.airline_name}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* JADWAL GRID */}
                    <div className="flex-1 grid grid-cols-3 gap-2">
                        
                        {/* COL 1: Origin */}
                        <div className="flex flex-col items-start min-w-fit">
                            {/* Airline Name */}
                            <div className="h-7 mb-2 flex items-center whitespace-nowrap">
                                <span className="font-medium text-gray-900 text-[15px]">
                                    {data.flight.airline_name} <span className="text-gray-300 mx-2 font-light">|</span> {data.flight.flight_code}
                                </span>
                            </div>
                            
                            <p className="text-[15px] font-medium text-gray-900 ">{formatTime(data.flight.departure_time)}</p>
                            <p className="text-[11px] text-gray-500 mb-0.5">{formatDate(data.flight.departure_time)}</p>
                            <p className="text-[11px] text-gray-500">{getCode(data.flight.origin)}</p>
                        </div>

                        {/* COL 2: Duration */}
                        <div className="flex flex-col items-center">
                            {/* Spacer for Title */}
                            <div className="h-7 mb-2"></div>
                            
                            <p className="text-[13px] text-gray-900 mb-1">{formatDuration(data.flight.duration_minutes)}</p>
                            <p className="text-[11px] text-gray-500 text-center">Langsung</p>
                        </div>

                        {/* COL 3: Destination */}
                        <div className="flex flex-col items-end">
                            {/* Spacer for Title */}
                            <div className="h-7 mb-2"></div>
                            
                            <p className="text-[15px] font-medium text-gray-900 ">{formatTime(data.flight.arrival_time)}</p>
                            <p className="text-[11px] text-gray-500 mb-0.5 text-right">{formatDate(data.flight.arrival_time)}</p>
                            <p className="text-[11px] text-gray-500 text-right">{getCode(data.flight.destination)}</p>
                        </div>
                    </div>
                </div>

                {/* SEPARATOR */}
                <div className="hidden md:block w-[1px] bg-gray-100 self-stretch mx-4"></div>

                {/* KANAN: Harga & Status */}
                <div className="w-full md:w-auto flex flex-col justify-center min-w-[160px]">
                    <div className="text-center">
                        <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                            ECONOMY | 1.9
                        </p>
                        <div className="flex items-center justify-center gap-1.5 mb-2">
                            <span className="text-red-600 font-bold text-sm">IDR</span>
                            <span className="text-red-600 font-bold text-lg tracking-wide">
                                {new Intl.NumberFormat('id-ID').format(parseFloat(data.total_amount))}
                            </span>
                        </div>
                        <div className="mt-3 flex justify-center">
                            {isCancelled ? (
                                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                    Dibatalkan
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                    Berhasil
                                </span>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* === FOOTER CARD (Detail Toggle) === */}
            <div 
                className={`bg-white px-6 py-3 border-t border-gray-100 flex justify-between items-center ${isCancelled ? "cursor-pointer hover:bg-gray-50 transition" : ""}`}
                onClick={() => isCancelled && setIsOpen(!isOpen)}
            >
                <div className="text-[11px] font-medium text-gray-900">
                    Kode Booking: <span className="font-mono font-bold ml-1">{data.booking_code}</span>
                </div>
                
                {/* Toggle hanya muncul jika Dibatalkan */}
                {isCancelled ? (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-gray-900 select-none">
                        <span>Tampilkan Detail</span>
                        <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                ) : (
                    <div className="text-[11px] font-medium text-green-600 flex items-center gap-1">
                        <FiCheckCircle className="text-xs" />
                        <span>E-Tiket Terbit</span>
                    </div>
                )}
            </div>
            {/* === DROPDOWN CONTENT === */}
            {isOpen && isCancelled && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 animate-in slide-in-from-top-1">
                    
                    {/* ISI DROPDOWN: Info Batal jika Gagal */}
                    <>
                        <div className="text-xs text-gray-500 mb-2">
                            Kode Booking: <span className="font-mono font-bold text-gray-700">{data.booking_code}</span>
                        </div>

                        <span className="flex items-center gap-1.5 text-red-600 bg-red-100 px-3 py-1 rounded-full text-xs font-bold w-fit">
                            <FiXCircle /> Dibatalkan / Gagal
                        </span>
                        
                        <p className="text-xs text-gray-500 mt-3">
                            Mohon maaf, transaksi ini telah dibatalkan atau pembayaran gagal. Silakan lakukan pemesanan ulang.
                        </p>
                    </>
                </div>
            )}

        </div>
    );
};