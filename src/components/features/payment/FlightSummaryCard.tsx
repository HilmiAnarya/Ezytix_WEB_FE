import React from "react";
import { Plane, Users, Clock, User, ArrowRight } from "lucide-react";
import { Booking } from "../../../types/booking";

interface Props {
    bookings: Booking[]; // Menerima Array Booking (untuk Round Trip)
}

export const FlightSummaryCard: React.FC<Props> = ({ bookings }) => {
    // 1. Urutkan berdasarkan waktu keberangkatan (Pergi -> Pulang)
    const sortedBookings = [...bookings].sort((a, b) => 
        new Date(a.flight.departure_time).getTime() - new Date(b.flight.departure_time).getTime()
    );

    // Helpers Format
    const formatDate = (isoString: string) => {
        const d = new Date(isoString);
        return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const getCode = (location: string) => {
        const match = location.match(/\(([^)]+)\)/);
        return match ? match[1] : location.substring(0, 3).toUpperCase();
    };

    const formatDuration = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}j ${m}m`;
    };

    if (sortedBookings.length === 0) return null;

    // Ambil penumpang dari booking pertama (asumsi penumpang sama untuk roundtrip)
    const passengers = sortedBookings[0].passengers;
    const orderId = sortedBookings[0].order_id; // Ambil Order ID untuk Header

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm text-sm">
            {/* Global Header */}
            <div className="bg-gray-50 py-3 px-4 border-b border-gray-100 flex items-center gap-3">
                <Plane className="w-4 h-4 text-gray-500" />
                <div>
                    <div className="font-bold text-gray-800 text-sm">Ringkasan Pesanan</div>
                    <div className="text-[10px] text-gray-500">Order ID: <span className="font-mono text-gray-700 font-medium">{orderId}</span></div>
                </div>
            </div>

            <div className="p-4 space-y-6">
                
                {/* LOOPING FLIGHTS (Pergi & Pulang) */}
                {sortedBookings.map((booking, index) => {
                    const isReturn = index > 0; // Jika index > 0, berarti ini penerbangan pulang
                    
                    return (
                        <div key={booking.booking_code} className="relative">
                            {/* Label Penerbangan */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${isReturn ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                    {isReturn ? "Penerbangan Pulang" : "Penerbangan Pergi"}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">
                                    ID: {booking.booking_code}
                                </span>
                            </div>

                            {/* Route & Class */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2 text-base font-bold text-gray-900">
                                        <span>{getCode(booking.flight.origin)}</span>
                                        <ArrowRight className="w-3 h-3 text-gray-300" />
                                        <span>{getCode(booking.flight.destination)}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-1">
                                        {booking.flight.origin} → {booking.flight.destination}
                                    </div>
                                </div>
                                <div className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold rounded uppercase border border-gray-100">
                                    {booking.flight.seat_class}
                                </div>
                            </div>

                            {/* Airline Info */}
                            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100 mb-3">
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
                                <div className="text-left min-w-[60px]">
                                    <div className="text-sm font-bold text-gray-900">{formatTime(booking.flight.departure_time)}</div>
                                    <div className="text-[10px] text-gray-500">{formatDate(booking.flight.departure_time)}</div>
                                </div>

                                <div className="text-center px-2 flex flex-col items-center flex-1">
                                    <div className="text-[10px] font-medium text-gray-400 mb-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDuration(booking.flight.duration_minutes)}
                                    </div>
                                    <div className="w-full h-[1px] bg-gray-200 relative my-1">
                                        <div className="absolute -top-[2px] left-0 w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                        <div className="absolute -top-[2px] right-0 w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                    </div>
                                    <div className="text-[10px] text-gray-500 font-bold mt-1 uppercase">
                                        Langsung
                                    </div>
                                </div>

                                <div className="text-right min-w-[60px]">
                                    <div className="text-sm font-bold text-gray-900">{formatTime(booking.flight.arrival_time)}</div>
                                    <div className="text-[10px] text-gray-500">{formatDate(booking.flight.arrival_time)}</div>
                                </div>
                            </div>

                            {/* Divider antar penerbangan (jika bukan yang terakhir) */}
                            {!isReturn && sortedBookings.length > 1 && (
                                <div className="my-6 border-t border-dashed border-gray-300 relative">
                                    <div className="absolute left-0 -top-1.5 -ml-4 w-3 h-3 bg-gray-100 rounded-full"></div>
                                    <div className="absolute right-0 -top-1.5 -mr-4 w-3 h-3 bg-gray-100 rounded-full"></div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Divider List Penumpang */}
                <div className="border-t border-dashed border-gray-200" />

                {/* Passenger Info (Shared) */}
                <div>
                    <h4 className="text-xs font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Users className="w-3 h-3 text-gray-400" />
                        Daftar Penumpang
                    </h4>
                    
                    {passengers && passengers.length > 0 ? (
                        <div className="space-y-2">
                            {passengers.map((pax, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded border border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            <User className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-700 capitalize">
                                                {pax.full_name}
                                            </div>
                                            <div className="text-[10px] text-gray-400 capitalize">
                                                {pax.type === 'tuan' || pax.type === 'nyonya' ? 'Dewasa' : pax.type}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-xs text-gray-400 italic text-center">
                            Memuat data penumpang...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};