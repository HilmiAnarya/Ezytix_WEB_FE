/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

interface FilterBarProps {
  onFilterChange: (filters: any) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedTransits, setSelectedTransits] = useState<string[]>([]);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTransit = (value: string) => {
    let newTransits;
    if (selectedTransits.includes(value)) {
      newTransits = selectedTransits.filter((t) => t !== value);
    } else {
      newTransits = [...selectedTransits, value];
    }
    setSelectedTransits(newTransits);
    onFilterChange({ transit: newTransits });
  };
  const FilterButton = ({ label, id, isActive, hasValue }: { label: string, id: string, isActive: boolean, hasValue: boolean }) => (
    <div className="relative">
        <button
        onClick={() => setActiveDropdown(activeDropdown === id ? null : id)}
        className={`px-5 py-2.5 rounded-full text-sm font-bold border transition flex items-center gap-2 shadow-sm
            ${isActive || hasValue 
            ? "border-red-600 text-red-600 bg-red-50" 
            : "border-transparent bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md" // Efek Floating
            }`}
        >
        {label}
        <FiChevronDown className={`transition-transform ${isActive ? "rotate-180" : ""}`} />
        
        {hasValue && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full border-2 border-white"></span>
        )}
        </button>
    </div>
  );

  return (
    <div className="py-2" ref={barRef}> 
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <div className="relative">
            <FilterButton label="Transit" id="transit" isActive={activeDropdown === "transit"} hasValue={selectedTransits.length > 0} />
            {activeDropdown === "transit" && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-fadeIn">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">Jumlah Transit</p>
                <div className="space-y-2">
                  {[
                    { label: "Langsung", value: "0" },
                    { label: "1 Transit", value: "1" },
                    { label: "2+ Transit", value: "2+" }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center justify-between cursor-pointer group p-2 hover:bg-gray-50 rounded-lg transition">
                      <span className="text-sm font-medium text-gray-700">{option.label}</span>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${selectedTransits.includes(option.value) ? "bg-red-600 border-red-600" : "border-gray-300"}`}>
                        {selectedTransits.includes(option.value) && <FiCheck className="text-white text-xs" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={selectedTransits.includes(option.value)} onChange={() => toggleTransit(option.value)} />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <FilterButton label="Harga" id="price" isActive={false} hasValue={false} />
          <FilterButton label="Waktu" id="time" isActive={false} hasValue={false} />
          <FilterButton label="Maskapai" id="airline" isActive={false} hasValue={false} />
          {(selectedTransits.length > 0) && (
             <button onClick={() => setSelectedTransits([])} className="text-gray-400 text-xs font-bold hover:text-red-600 ml-2">Reset</button>
          )}

      </div>
    </div>
  );
};