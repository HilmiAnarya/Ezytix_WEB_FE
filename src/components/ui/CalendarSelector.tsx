import React, { useState, useEffect, useRef } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Props {
  label: string;
  selectedDate: string; // Format YYYY-MM-DD
  onChange: (date: string) => void;
  minDate?: string;     // Format YYYY-MM-DD
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export const CalendarSelector: React.FC<Props> = ({ 
  label, selectedDate, onChange, minDate, disabled = false, className, placeholder 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // State Internal Kalender (Bulan yang sedang dilihat user)
  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [viewDate, setViewDate] = useState(initialDate);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close outside logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helpers
  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    // Adjust timezone offset agar tidak geser hari saat toISOString
    const offset = newDate.getTimezoneOffset();
    const localDate = new Date(newDate.getTime() - (offset * 60 * 1000));
    
    onChange(localDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const isDateDisabled = (day: number) => {
    if (!minDate) return false;
    const current = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const min = new Date(minDate);
    // Set hours to 0 for accurate comparison
    current.setHours(0,0,0,0);
    min.setHours(0,0,0,0);
    return current < min;
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const selected = new Date(selectedDate);
    return selected.getDate() === day && 
           selected.getMonth() === viewDate.getMonth() && 
           selected.getFullYear() === viewDate.getFullYear();
  };

  // Format Tampilan di Input Box
  const displayDate = selectedDate ? new Date(selectedDate).toLocaleDateString('id-ID', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  }) : (placeholder || "-");

  // Generate Calendar Grid
  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(viewDate);
    const startDay = firstDayOfMonth(viewDate); // 0 = Sunday

    // Empty cells before start of month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    // Days
    for (let day = 1; day <= totalDays; day++) {
      const disabledDay = isDateDisabled(day);
      const selected = isSelected(day);

      days.push(
        <button
          key={day}
          disabled={disabledDay}
          onClick={() => handleDateClick(day)}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
            ${selected 
              ? 'bg-red-600 text-white shadow-md shadow-red-200' 
              : disabledDay 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
            }`}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* TRIGGER INPUT */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl transition h-[72px] border border-transparent
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}
        `}
      >
        <FiCalendar className={`${disabled ? 'text-gray-400' : selectedDate ? 'text-red-500' : 'text-gray-400'} text-xl flex-shrink-0`} />
        <div className="flex flex-col w-full overflow-hidden">
           <span className="text-xs text-gray-500 font-semibold uppercase mb-0.5">{label}</span>
           <span className={`text-sm font-bold truncate ${disabled ? 'text-gray-400' : 'text-gray-800'}`}>
             {displayDate}
           </span>
        </div>
      </div>

      {/* DROPDOWN CONTENT */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-2 w-[320px] bg-white rounded-xl shadow-2xl z-50 p-4 border border-gray-100 ring-1 ring-black ring-opacity-5 select-none">
          
          {/* Header: Month Navigation */}
          <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-600">
              <FiChevronLeft size={20} />
            </button>
            <span className="font-bold text-gray-800">
              {viewDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-600">
              <FiChevronRight size={20} />
            </button>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 mb-2">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
              <div key={d} className="h-8 flex items-center justify-center text-xs font-bold text-gray-400">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {renderCalendarDays()}
          </div>
          
          {/* Footer Info */}
          {minDate && (
             <div className="mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-400 text-center">
                *Tanggal sebelum hari ini tidak tersedia
             </div>
          )}
        </div>
      )}
    </div>
  );
};