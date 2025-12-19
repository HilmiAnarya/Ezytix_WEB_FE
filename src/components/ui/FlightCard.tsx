import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiBriefcase, FiClock } from "react-icons/fi";
import { Flight } from "../../types/api";

// --- HELPERS ---
const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(parseFloat(amount));
};

const formatTime = (isoString: string) => {
  if (!isoString) return "--:--"; // Safety Check
  return new Date(isoString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const formatDate = (isoString: string) => {
  if (!isoString) return "-"; // Safety Check
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short'
  });
};

// --- COMPONENT ---
interface Props {
  flight: Flight;
  // 🔥 UPDATE 1: Tambahkan prop onSelect agar Parent bisa mengontrol logic
  onSelect: () => void;
}

export const FlightCard: React.FC<Props> = ({ flight, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Safety Check untuk Flight Classes (Harga)
  const displayPrice = flight.flight_classes?.[0]?.price || "0";

  // Pastikan legs adalah array
  const legs = flight.flight_legs || []; 

  return (
    <div className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
      isOpen ? "shadow-md border-red-100" : "shadow-sm border-gray-200 hover:shadow-md"
    }`}>
      
      {/* HEADER CARD */}
      <div 
        className="p-5 cursor-pointer relative" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* 1. MASKAPAI */}
            <div className="flex items-center gap-4 w-full md:w-1/4">
                <div className="w-12 h-12 flex items-center justify-center p-1 bg-white border border-gray-100 rounded-lg shadow-sm">
                   {flight.airline?.logo_url ? (
                     <img 
                       src={flight.airline.logo_url} 
                       alt={flight.airline.name} 
                       className="max-h-full max-w-full object-contain" 
                     />
                   ) : (
                     <div className="text-[10px] text-gray-400">No Logo</div>
                   )}
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-sm md:text-base">
                        {flight.airline?.name || "Unknown Airline"}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit">
                        {flight.flight_code}
                    </span>
                </div>
            </div>

            {/* 2. JADWAL */}
            <div className="flex items-center justify-center gap-4 md:gap-8 w-full md:w-2/4">
                <div className="text-center min-w-[60px]">
                    <p className="text-xl font-bold text-gray-800">{formatTime(flight.departure_time)}</p>
                    <p className="text-xs font-medium text-gray-500">{flight.origin?.code}</p>
                </div>

                <div className="flex flex-col items-center w-full max-w-[120px]">
                    <span className="text-[10px] text-gray-400 mb-1">{flight.duration_formatted}</span>
                    <div className="relative w-full h-[2px] bg-gray-300 flex items-center justify-between">
                        <div className="w-2 h-2 bg-white border-2 border-gray-400 rounded-full"></div>
                        {flight.transit_count > 0 && (
                            <div className="w-2 h-2 bg-white border-2 border-red-500 rounded-full"></div>
                        )}
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                    <span className={`text-[10px] mt-1 font-bold ${flight.transit_count > 0 ? "text-red-500" : "text-green-600"}`}>
                        {flight.transit_count === 0 ? "Langsung" : flight.transit_info}
                    </span>
                </div>

                <div className="text-center min-w-[60px]">
                    <p className="text-xl font-bold text-gray-800">{formatTime(flight.arrival_time)}</p>
                    <p className="text-xs font-medium text-gray-500">{flight.destination?.code}</p>
                </div>
            </div>

            {/* 3. HARGA & TOMBOL PILIH */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-1/4 gap-1">
                <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{formatCurrency(displayPrice)}</p>
                    <p className="text-xs text-gray-400">/pax</p>
                </div>
                
                {/* 🔥 UPDATE 2: Panggil onSelect saat diklik */}
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); // Mencegah accordion terbuka
                    onSelect(); // Trigger logic di Parent
                  }}
                  className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-red-700 transition"
                >
                    Pilih
                </button>
            </div>
        </div>

        <div className="flex justify-center mt-4 md:mt-0 md:absolute md:bottom-2 md:left-1/2 md:-translate-x-1/2">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-red-500 transition select-none">
                <span>{isOpen ? "Tutup Detail" : "Detail Penerbangan"}</span>
                {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </div>
        </div>
      </div>

      {/* ACCORDION DETAIL */}
      {isOpen && (
        <div className="bg-gray-50 border-t border-gray-100 p-4 md:p-6 animate-fadeIn">
            <div className="max-w-3xl mx-auto">
                
                {legs.length > 0 ? legs.map((leg, idx) => (
                    <div key={leg.id} className="relative">
                        
                        <div className="relative pl-6 md:pl-8 pb-8 border-l-2 border-gray-300 border-dashed last:border-0 last:pb-0">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white bg-gray-400 shadow-sm z-10"></div>
                            
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative top-[-6px]">
                                <div className="flex items-center gap-3 mb-3 border-b border-gray-50 pb-2">
                                    <img src={leg.airline?.logo_url} alt="logo" className="h-5 w-auto" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-800">
                                            {leg.airline?.name} <span className="text-gray-400 font-normal text-xs">• {leg.flight_number}</span>
                                        </span>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                            <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">Economy</span>
                                            <span>•</span>
                                            <span>{leg.duration_formatted}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-16 text-right">
                                            <p className="font-bold text-gray-800">{formatTime(leg.departure_time)}</p>
                                            <p className="text-[10px] text-gray-500">{formatDate(leg.departure_time)}</p>
                                        </div>
                                        <div className="flex flex-col border-l-2 border-red-500 pl-4 py-1">
                                            <p className="text-sm font-medium text-gray-700">{leg.origin?.city_name} ({leg.origin?.code})</p>
                                            <p className="text-xs text-gray-400">{leg.origin?.airport_name}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-16 text-right">
                                            <p className="font-bold text-gray-800">{formatTime(leg.arrival_time)}</p>
                                            <p className="text-[10px] text-gray-500">{formatDate(leg.arrival_time)}</p>
                                        </div>
                                        <div className="flex flex-col border-l-2 border-green-500 pl-4 py-1">
                                            <p className="text-sm font-medium text-gray-700">{leg.destination?.city_name} ({leg.destination?.code})</p>
                                            <p className="text-xs text-gray-400">{leg.destination?.airport_name}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 flex gap-3 text-xs text-gray-400 border-t border-gray-50 pt-2">
                                     <span className="flex items-center gap-1"><FiBriefcase /> Bagasi 20 kg</span>
                                     <span className="flex items-center gap-1"><FiClock /> Makan Siang</span>
                                </div>
                            </div>
                        </div>

                        {leg.layover_duration_formatted && (
                            <div className="relative pl-8 pb-8 border-l-2 border-gray-300 border-dashed">
                                <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
                                    <FiClock className="text-lg" />
                                    <span>
                                        Transit di <span className="underline">{leg.destination?.city_name}</span> selama {leg.layover_duration_formatted}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )) : (
                  <div className="p-4 text-center text-gray-400 text-sm">Detail penerbangan tidak tersedia.</div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};