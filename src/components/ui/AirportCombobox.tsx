import React, { useState, useEffect, useRef } from "react";
import { FiMapPin, FiSearch, FiChevronDown } from "react-icons/fi";
import { Airport } from "../../types/api";

interface Props {
  // Label kita keep di interface tapi tidak dirender visual
  label?: string; 
  icon?: React.ReactNode;
  airports: Airport[];
  value: Airport | null;
  onChange: (airport: Airport) => void;
  placeholder?: string;
  // [NEW] Prop untuk mengatur arah munculnya popup (Default: 'left')
  popoverAlign?: "left" | "right";
}

export const AirportCombobox: React.FC<Props> = ({
  airports, value, onChange, placeholder, 
  popoverAlign = "left" // Default Left
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter Logic
  const filteredAirports = airports.filter((airport) =>
    airport.city_name.toLowerCase().includes(search.toLowerCase()) ||
    airport.code.toLowerCase().includes(search.toLowerCase()) ||
    airport.airport_name.toLowerCase().includes(search.toLowerCase())
  );

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto focus search saat dibuka
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
        searchInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      
      {/* TRIGGER BOX */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
            group flex items-center gap-3 w-full h-[54px] px-4 rounded-2xl cursor-pointer transition-all border select-none
            ${isOpen 
                ? "bg-white border-red-500 shadow-red-100 ring-2 ring-red-100" 
                : "bg-gray-50 border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-sm"
            }
        `}
      >
        {/* Value Text */}
        <div className="flex-1 min-w-0">
          <p className={`text-base font-bold truncate ${value ? "text-gray-900" : "text-gray-400"}`}>
            {value ? `${value.city_name} (${value.code})` : placeholder || "Pilih Kota"}
          </p>
        </div>

        {/* Chevron Icon */}
        <FiChevronDown className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* DROPDOWN CONTENT */}
      {isOpen && (
        <div 
            // [UPDATE] Logic Alignment: Jika 'right', gunakan 'right-0'
            className={`absolute top-full mt-2 w-full md:w-[400px] bg-white rounded-2xl shadow-xl z-50 overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200 ${
                popoverAlign === 'right' ? 'right-0' : 'left-0'
            }`}
        >
          
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 transition-all">
              <FiSearch className="text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Cari Jakarta, Bali, atau kode (CGK)..."
                className="bg-transparent outline-none w-full text-sm font-medium text-gray-700 placeholder-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* List Bandara */}
          <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
          {filteredAirports.length > 0 ? (
            filteredAirports.map((airport) => (
              <div
                key={airport.id}
                onClick={() => {
                  onChange(airport);
                  setIsOpen(false);
                  setSearch("");
                }}
                className="px-5 py-3 hover:bg-red-50 cursor-pointer border-b border-gray-50 last:border-none group transition-colors"
              >
                <div className="flex flex-col gap-1">
                    
                    {/* BARIS 1: Nama Bandara + Kode */}
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800 text-sm truncate pr-2 group-hover:text-red-700">
                            {airport.airport_name}
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] font-black shrink-0 group-hover:bg-red-100 group-hover:text-red-600">
                            {airport.code}
                        </span>
                    </div>

                    {/* BARIS 2: Lokasi (Kota, Negara) */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-red-500/80">
                        <span className="font-medium">{airport.city_name}</span>
                        <span className="text-gray-300">•</span>
                        <span>{airport.country}</span>
                    </div>

                </div>
              </div>
            ))
            ) : (
              <div className="p-8 text-center flex flex-col items-center gap-2 text-gray-400">
                <FiMapPin className="text-3xl opacity-20" />
                <span className="text-sm font-medium">Bandara tidak ditemukan</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};