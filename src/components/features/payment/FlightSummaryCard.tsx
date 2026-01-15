import React from "react";
import { Plane, User } from "lucide-react";
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

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm text-sm">
            {/* Header */}
            <div className="bg-gray-50 py-3 px-4 border-b border-gray-100 flex items-center gap-3">
                <Plane className="w-4 h-4 text-gray-500" />
                <div>
                    <div className="font-bold text-gray-800 text-sm">Ringkasan Penerbangan</div>
                    <div className="text-[10px] text-gray-500">Booking ID : <span className="font-mono">{booking.booking_code}</span></div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {/* Route */}
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                        <span>{getCode(booking.flight.origin)}</span>
                        <span className="text-gray-400">→</span>
                        <span>{getCode(booking.flight.destination)}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                        {booking.flight.origin} ke {booking.flight.destination}
                    </div>
                </div>

                {/* Airline */}
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white border border-gray-100 rounded-full flex items-center justify-center p-1">
                        <img src={booking.flight.airline_logo} alt="logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{booking.flight.airline_name}</span>
                </div>

                {/* Time Grid */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="text-center">
                        <div className="text-sm font-bold text-gray-900">{formatTime(booking.flight.departure_time)}</div>
                        <div className="text-[10px] text-gray-500">{formatDate(booking.flight.departure_time)}</div>
                    </div>

                    <div className="text-center px-2 flex flex-col items-center">
                        <div className="text-[10px] font-medium text-gray-400 mb-1">{booking.flight.duration_minutes}m</div>
                        <div className="w-12 h-[1px] bg-gray-300 relative">
                            <div className="absolute -top-[3px] right-0 w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">Langsung</div>
                    </div>

                    <div className="text-center">
                        <div className="text-sm font-bold text-gray-900">{formatTime(booking.flight.arrival_time)}</div>
                        <div className="text-[10px] text-gray-500">{formatDate(booking.flight.arrival_time)}</div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Passenger Details (Dummy dulu jika API belum return detail penumpang) */}
                <div>
                    <h4 className="text-xs font-bold text-gray-800 mb-3">Detail Penumpang</h4>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-900">1 Penumpang</div>
                            <div className="text-[10px] text-gray-500">Dewasa (Economy)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};