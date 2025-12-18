import React, { useState, useEffect, useRef } from "react";
import { FiMapPin, FiSearch } from "react-icons/fi";
import { Airport } from "../../types/api";

interface Props {
  label: string;
  icon?: React.ReactNode;
  airports: Airport[];
  value: Airport | null;
  onChange: (airport: Airport) => void;
  placeholder?: string;
}

export const AirportCombobox: React.FC<Props> = ({ label, icon, airports, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter bandara berdasarkan ketikan user (Code, City, atau Name)
  const filteredAirports = airports.filter((airport) =>
    airport.city_name.toLowerCase().includes(search.toLowerCase()) ||
    airport.code.toLowerCase().includes(search.toLowerCase()) ||
    airport.airport_name.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* TRIGGER BUTTON (Tampilan Input) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-200 transition"
      >
        {icon || <FiMapPin className="text-red-500 text-xl" />}
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs text-gray-500 font-semibold uppercase">{label}</span>
          <span className="text-sm font-bold text-gray-800 truncate">
            {value ? `${value.city_name} (${value.code})` : placeholder || "Pilih Bandara"}
          </span>
        </div>
      </div>

      {/* DROPDOWN CONTENT */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full md:w-[350px] bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-100">
          {/* Search Input di dalam Dropdown */}
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
              <FiSearch className="text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Cari kota atau kode bandara..."
                className="bg-transparent outline-none w-full text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* List Bandara */}
          <div className="max-h-60 overflow-y-auto">
            {filteredAirports.length > 0 ? (
              filteredAirports.map((airport) => (
                <div
                  key={airport.id}
                  onClick={() => {
                    onChange(airport);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className="px-4 py-3 hover:bg-red-50 cursor-pointer border-b border-gray-50 last:border-none group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{airport.city_name}</p>
                      <p className="text-xs text-gray-500">{airport.airport_name}</p>
                    </div>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold group-hover:bg-red-100 group-hover:text-red-600">
                      {airport.code}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400 text-sm">
                Bandara tidak ditemukan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};