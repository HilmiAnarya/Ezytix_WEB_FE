import React, { useState, useRef, useEffect } from "react";
import { FiUsers } from "react-icons/fi";

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

  // --- LOGIC VALIDASI PENUMPANG ---
  const handleChange = (type: 'adult' | 'child' | 'infant', operation: 'inc' | 'dec') => {
    let newAdults = adults;
    let newChildren = children;
    let newInfants = infants;

    if (type === 'adult') {
      if (operation === 'inc') {
        if (newAdults + newChildren < 7) newAdults++;
      } else {
        if (newAdults > 1 && newAdults > newInfants) newAdults--; // Dewasa min 1 & harus > bayi
      }
    } else if (type === 'child') {
      if (operation === 'inc') {
        if (newAdults + newChildren < 7) newChildren++;
      } else {
        if (newChildren > 0) newChildren--;
      }
    } else if (type === 'infant') {
      if (operation === 'inc') {
        if (newInfants < 4 && newInfants < newAdults) newInfants++; // Bayi max 4 & harus < dewasa
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

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-200 transition h-[72px]"
      >
        <FiUsers className="text-red-500 text-xl flex-shrink-0" />
        <div className="flex flex-col w-full overflow-hidden">
           <span className="text-xs text-gray-500 font-semibold uppercase mb-0.5">Penumpang & Kelas</span>
           <span className="text-sm font-bold text-gray-800 truncate">
             {adults + children + infants} Penumpang, {seatClassOptions.find(s => s.value === seatClass)?.label}
           </span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[320px] bg-white rounded-xl shadow-2xl z-50 p-5 border border-gray-100 ring-1 ring-black ring-opacity-5">
          <div className="space-y-4 mb-4">
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

          <div className="border-t border-gray-100 my-4"></div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase">Kelas Kabin</p>
            <div className="flex flex-wrap gap-2">
              {seatClassOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onUpdate(adults, children, infants, opt.value)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border transition ${
                    seatClass === opt.value
                      ? 'bg-red-500 text-white border-red-500 shadow-md shadow-red-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-5 flex justify-end">
             <button onClick={() => setIsOpen(false)} className="text-red-600 text-sm font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition">Selesai</button>
          </div>
        </div>
      )}
    </div>
  );
};

const CounterRow = ({ label, desc, value, onDec, onInc, disableDec, disableInc }: any) => (
  <div className="flex justify-between items-center">
    <div>
      <p className="font-bold text-gray-800 text-sm">{label}</p>
      <p className="text-xs text-gray-400">{desc}</p>
    </div>
    <div className="flex items-center gap-3">
      <button 
        onClick={onDec} disabled={disableDec}
        className={`w-8 h-8 rounded-full flex items-center justify-center border transition ${disableDec ? 'opacity-30 cursor-not-allowed border-gray-200 text-gray-300' : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'}`}
      > - </button>
      <span className="w-4 text-center text-sm font-bold text-gray-800">{value}</span>
      <button 
        onClick={onInc} disabled={disableInc}
        className={`w-8 h-8 rounded-full flex items-center justify-center border transition ${disableInc ? 'opacity-30 cursor-not-allowed border-gray-200 text-gray-300' : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'}`}
      > + </button>
    </div>
  </div>
);