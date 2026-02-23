/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { FiUsers, FiChevronDown } from "react-icons/fi";

interface Props {
  adults: number;
  children: number;
  infants: number;
  seatClass: string;
  onUpdate: (adults: number, children: number, infants: number, seatClass: string) => void;
}

export const PassengerSelector: React.FC<Props> = ({ adults, children, infants, seatClass, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (type: 'adult' | 'child' | 'infant', operation: 'inc' | 'dec') => {
    let newAdults = adults;
    let newChildren = children;
    let newInfants = infants;

    if (type === 'adult') {
      if (operation === 'inc') {
        if (newAdults + newChildren < 7) newAdults++;
      } else {
        if (newAdults > 1 && newAdults > newInfants) newAdults--;
      }
    } else if (type === 'child') {
      if (operation === 'inc') {
        if (newAdults + newChildren < 7) newChildren++;
      } else {
        if (newChildren > 0) newChildren--;
      }
    } else if (type === 'infant') {
      if (operation === 'inc') {
        if (newInfants < 4 && newInfants < newAdults) newInfants++;
      } else {
        if (newInfants > 0) newInfants--;
      }
    }
    onUpdate(newAdults, newChildren, newInfants, seatClass);
  };

  const seatClassOptions = [
    { value: 'economy', label: 'Economy' },
    { value: 'business', label: 'Business' },
    { value: 'first_class', label: 'First Class' },
  ];

  const totalPassenger = adults + children + infants;
  const seatClassLabel = seatClassOptions.find(s => s.value === seatClass)?.label || "Economy";

  return (
    <div className="relative w-full" ref={dropdownRef}>
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
        <span className={`text-xl transition-colors ${isOpen ? "text-red-500" : "text-gray-400 group-hover:text-red-500"}`}>
            <FiUsers />
        </span>

        <div className="flex-1 min-w-0 text-left">
           <p className="text-base font-bold truncate text-gray-900">
             {totalPassenger}, {seatClassLabel}
           </p>
        </div>

         <FiChevronDown className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[340px] bg-white rounded-2xl shadow-xl z-50 p-5 border border-gray-100 ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-5 mb-5">
            <CounterRow 
              label="Dewasa" desc="(12+ tahun)" value={adults} 
              onDec={() => handleChange('adult', 'dec')} onInc={() => handleChange('adult', 'inc')}
              disableDec={adults <= 1 || adults === infants} disableInc={adults + children >= 7}
            />
            <CounterRow 
              label="Anak" desc="(2-11 tahun)" value={children} 
              onDec={() => handleChange('child', 'dec')} onInc={() => handleChange('child', 'inc')}
              disableDec={children <= 0} disableInc={adults + children >= 7}
            />
            <CounterRow 
              label="Bayi" desc="(< 2 tahun)" value={infants} 
              onDec={() => handleChange('infant', 'dec')} onInc={() => handleChange('infant', 'inc')}
              disableDec={infants <= 0} disableInc={infants >= 4 || infants >= adults}
            />
          </div>

          <div className="border-t border-gray-100 my-5"></div>
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-left">Kelas Kabin</p>
            <div className="flex flex-wrap gap-2">
              {seatClassOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onUpdate(adults, children, infants, opt.value)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    seatClass === opt.value
                      ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-200'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600 hover:bg-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
                onClick={() => setIsOpen(false)} 
                className="text-red-600 text-sm font-bold hover:bg-red-50 px-5 py-2.5 rounded-xl transition-colors"
            >
                Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CounterRow = ({ label, desc, value, onDec, onInc, disableDec, disableInc }: any) => (
  <div className="flex justify-between items-center">
    <div className="text-left">
      <p className="font-bold text-gray-800 text-sm">{label}</p>
      <p className="text-xs text-gray-400 font-medium">{desc}</p>
    </div>
    <div className="flex items-center gap-4">
      <button 
        onClick={onDec} disabled={disableDec}
        className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
            disableDec 
            ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' 
            : 'bg-white border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm'
        }`}
      > - </button>
      <span className="w-4 text-center text-base font-bold text-gray-900">{value}</span>
      <button 
        onClick={onInc} disabled={disableInc}
        className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
            disableInc 
            ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' 
            : 'bg-white border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm'
        }`}
      > + </button>
    </div>
  </div>
);