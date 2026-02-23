/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Flight } from "../../types/api";

const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(amount));
};

const formatTime = (isoString: string) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit', hour12: false,
    });
};

const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'short', year: '2-digit'
    });
};

const formatDateShort = (isoString: string) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short'
    });
};

interface Props {
    flight: Flight;
    onSelect: () => void;
    selectedSeatClass?: string;
}

export const FlightCard: React.FC<Props> = ({ flight, onSelect, selectedSeatClass = "Economy" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const legs = flight.flight_legs || [];

    const targetClass = useMemo(() => {
        if (!flight.flight_classes || flight.flight_classes.length === 0) return null;

        const found = flight.flight_classes.find(
            (fc) => fc.seat_class.toLowerCase() === selectedSeatClass.toLowerCase()
        );

        return found || flight.flight_classes[0];
    }, [flight.flight_classes, selectedSeatClass]);

    const displayPrice = targetClass ? targetClass.price : 0;
    const displayClassName = targetClass ? targetClass.seat_class : selectedSeatClass;
    const displayClassCode = targetClass?.class_code || ""; 

    return (
        <div className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${isOpen ? "shadow-md border-red-100" : "shadow-sm border-gray-200 hover:shadow-md"
            }`}>
            <div
                className="p-6 cursor-pointer relative flex flex-col md:flex-row gap-6 items-stretch"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex-1 flex gap-5 items-start">
                    <div className="w-14 h-14 flex-shrink-0 bg-white rounded-full border border-gray-100 flex items-center justify-center p-2 shadow-sm mt-1">
                        {flight.airline?.logo_url ? (
                            <img
                                src={flight.airline.logo_url}
                                alt={flight.airline.name}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="text-[8px] text-gray-400">No Logo</div>
                        )}
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-start">
                            <div className="h-7 mb-2 flex items-center">
                                <span className="font-medium text-gray-900 text-[15px]">
                                    {flight.airline?.name} <span className="text-gray-300 mx-2 font-light">|</span> {flight.flight_code}
                                </span>
                            </div>
                            <p className="text-[15px] font-medium text-gray-900 mb-1">{formatTime(flight.departure_time)}</p>
                            <p className="text-[11px] text-gray-500 mb-0.5">{formatDate(flight.departure_time)}</p>
                            <p className="text-[11px] text-gray-500">{flight.origin?.code}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="h-7 mb-2"></div>
                            <p className="text-[13px] text-gray-900 mb-1">{flight.duration_formatted}</p>
                            <p className="text-[11px] text-gray-500 text-center">
                                {flight.transit_count === 0 ? "Langsung" : flight.transit_info}
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="h-7 mb-2"></div>
                            <p className="text-[15px] font-medium text-gray-900 mb-1">{formatTime(flight.arrival_time)}</p>
                            <p className="text-[11px] text-gray-500 mb-0.5 text-right">{formatDate(flight.arrival_time)}</p>
                            <p className="text-[11px] text-gray-500 text-right">{flight.destination?.code}</p>
                        </div>
                    </div>
                </div>
                <div className="hidden md:block w-[1px] bg-gray-100 self-stretch mx-4"></div>
                <div className="w-full md:w-auto flex flex-col justify-center min-w-[160px]">
                    <div className="mb-4 text-center">
                        <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                            {displayClassName} {displayClassCode && <span className="text-red-500">| {displayClassCode}</span>}
                        </p>
                        <div className="flex items-center justify-center gap-1.5">
                            <span className="text-red-600 font-bold text-sm">IDR</span>
                            <span className="text-red-600 font-bold text-lg tracking-wide">
                                {formatCurrency(displayPrice).replace("Rp", "").trim()}
                            </span>
                            <span className="text-gray-400 text-[10px]">/pax</span>
                        </div>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect();
                        }}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition w-full shadow-sm"
                    >
                        Pilih
                    </button>
                </div>
            </div>
            <div className="bg-white px-6 py-3 border-t border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition" onClick={() => setIsOpen(!isOpen)}>
                <div className="text-[11px] font-medium text-gray-900">
                    Harga termasuk pajak & biaya
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-gray-900 select-none">
                    <span>Tampilkan Detail</span>
                    <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isOpen && (
                <div className="bg-white border-t border-gray-100 p-6 md:p-8 animate-fadeIn">
                    <div className="max-w-4xl mx-auto">
                        {legs.map((leg, idx) => (
                            <div key={leg.id}>
                                <div className="flex gap-6 relative">
                                    <div className="w-20 text-right pt-0.5 z-10 bg-white">
                                        <p className="text-sm font-bold text-gray-900">{formatTime(leg.departure_time)}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{formatDateShort(leg.departure_time)}</p>
                                    </div>
                                    <div className="relative flex justify-center w-6 flex-shrink-0">
                                        <div className="w-3 h-3 rounded-full border border-red-500 bg-white z-10 mt-1.5"></div>
                                        <div className="absolute top-3 bottom-0 w-[1px] bg-gray-200"></div>
                                    </div>
                                    <div className="flex-1 pb-8">
                                        <h4 className="font-bold text-gray-900 text-sm">
                                            {leg.origin?.city_name} ({leg.origin?.code})
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{leg.origin?.airport_name}</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 relative">
                                    <div className="w-20 text-right py-2 z-10 bg-white">
                                        <span className="text-xs text-gray-400 font-medium">{leg.duration_formatted}</span>
                                    </div>
                                    <div className="relative flex justify-center w-6 flex-shrink-0">
                                        <div className="w-[1px] bg-gray-200 h-full absolute top-0 bottom-0"></div>
                                    </div>
                                    <div className="flex-1 pb-10">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-bold text-gray-800 text-sm">{leg.airline?.name}</span>
                                            <img src={leg.airline?.logo_url} alt="logo" className="h-5 w-auto object-contain" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-700 mb-6">
                                            {leg.flight_number} • {displayClassName}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-6 relative">
                                    <div className="w-20 text-right pt-0.5 z-10 bg-white">
                                        <p className="text-sm font-bold text-gray-900">{formatTime(leg.arrival_time)}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{formatDateShort(leg.arrival_time)}</p>
                                    </div>
                                    <div className="relative flex justify-center w-6 flex-shrink-0">
                                        <div className="absolute top-0 h-2 w-[1px] bg-gray-200"></div>
                                        <div className="w-3 h-3 rounded-full bg-red-600 z-10 mt-1.5"></div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 text-sm">
                                            {leg.destination?.city_name} ({leg.destination?.code})
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{leg.destination?.airport_name}</p>
                                    </div>
                                </div>
                                {idx < legs.length - 1 && (
                                    <div className="py-8 pl-[104px]">
                                        <div className="flex justify-between items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm mb-1">
                                                    Transit di {leg.destination?.city_name}
                                                </h4>
                                                <p className="text-[10px] text-gray-400">Siapkan dokumen perjalanan Anda</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {leg.layover_duration_formatted}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};