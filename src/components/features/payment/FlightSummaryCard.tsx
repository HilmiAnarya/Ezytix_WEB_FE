import React from "react";
import { Plane, Users, Clock } from "lucide-react";
import { Booking } from "../../../types/booking";

interface Props {
    booking: Booking;
}

export const FlightSummaryCard: React.FC<Props> = ({ booking }) => {

    // Helpers Format Tanggal/Jam
    const formatDate = (isoString: string) => {
        const d = new Date(isoString);
        return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const getCode = (location: string) => {
        const match = location.match(/\(([^)]+)\)/);
        return match ? match[1] : location.substring(0, 3).toUpperCase();
    };

    // Helper Durasi (jika backend kirim menit)
    const formatDuration = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}j ${m}m`;
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm text-sm">
            {/* Header */}
            <div className="bg-gray-50 py-3 px-4 border-b border-gray-100 flex items-center gap-3">
                <Plane className="w-4 h-4 text-gray-500" />
                <div>
                    <div className="font-bold text-gray-800 text-sm">Ringkasan Penerbangan</div>
                    <div className="text-[10px] text-gray-500">Booking ID : <span className="font-mono text-gray-700 font-medium">{booking.booking_code}</span></div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-5">
                
                {/* Route Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-base font-bold text-gray-900">
                            <span>{getCode(booking.flight.origin)}</span>
                            <span className="text-gray-300 text-xs">●●●</span>
                            <span>{getCode(booking.flight.destination)}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1 max-w-[200px] leading-tight">
                            {booking.flight.origin} <span className="mx-1">→</span> {booking.flight.destination}
                        </div>
                    </div>
                    {/* Seat Class Badge */}
                    <div className="px-2 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded uppercase tracking-wide border border-red-100">
                        {booking.flight.seat_class}
                    </div>
                </div>

                {/* Airline Info */}
                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1 shadow-sm border border-gray-100 shrink-0">
                        {booking.flight.airline_logo ? (
                            <img src={booking.flight.airline_logo} alt="airline" className="w-full h-full object-contain" />
                        ) : (
                            <Plane className="w-4 h-4 text-gray-300" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-800">{booking.flight.airline_name}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{booking.flight.flight_code}</span>
                    </div>
                </div>

                {/* Time Grid */}
                <div className="flex items-center justify-between px-1">
                    <div className="text-left">
                        <div className="text-sm font-bold text-gray-900">{formatTime(booking.flight.departure_time)}</div>
                        <div className="text-[10px] text-gray-500">{formatDate(booking.flight.departure_time)}</div>
                    </div>

                    <div className="text-center px-4 flex flex-col items-center w-full">
                        <div className="text-[10px] font-medium text-gray-400 mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(booking.flight.duration_minutes)}
                        </div>
                        <div className="w-full h-[1px] bg-gray-200 relative my-1">
                            <div className="absolute -top-[2px] left-0 w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                            <div className="absolute -top-[2px] right-0 w-1.5 h-1.5 rounded-full bg-red-300"></div>
                        </div>
                        <div className="text-[10px] text-gray-400">Langsung</div>
                    </div>

                    <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">{formatTime(booking.flight.arrival_time)}</div>
                        <div className="text-[10px] text-gray-500">{formatDate(booking.flight.arrival_time)}</div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-gray-200" />

                {/* Passenger Info (Simplified) */}
                <div>
                    <h4 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <Users className="w-3 h-3 text-gray-400" />
                        Info Penumpang
                    </h4>
                    {/* Karena detail penumpang belum ada di API History, kita tampilkan placeholder yang masuk akal */}
                    <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        Total {booking.total_amount ? "1" : "?"} Penumpang (Detail tersedia di E-Ticket setelah pembayaran)
                        {/* Note: Nanti kalau backend update API history bawa passengers, kita loop di sini */}
                    </div>
                </div>
            </div>
        </div>
    );
};