import React, { useState, useEffect, useRef } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiChevronDown } from "react-icons/fi";

interface Props {
  label?: string;
  selectedDate: string;
  onChange: (date: string) => void;
  minDate?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  popoverAlign?: "left" | "right";
}

export const CalendarSelector: React.FC<Props> = ({
  selectedDate, onChange, minDate, disabled = false, className, placeholder,
  popoverAlign = "left"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [viewDate, setViewDate] = useState(initialDate);
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

  useEffect(() => {
    if (isOpen) {
      if (selectedDate) {
        setViewDate(new Date(selectedDate));
      } else {
        setViewDate(new Date());
      }
    }
  }, [isOpen, selectedDate]);

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
    const offset = newDate.getTimezoneOffset();
    const localDate = new Date(newDate.getTime() - (offset * 60 * 1000));

    onChange(localDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const isDateDisabled = (day: number) => {
    if (!minDate) return false;
    const current = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const min = new Date(minDate);
    current.setHours(0, 0, 0, 0);
    min.setHours(0, 0, 0, 0);
    return current < min;
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const selected = new Date(selectedDate);
    return selected.getDate() === day &&
      selected.getMonth() === viewDate.getMonth() &&
      selected.getFullYear() === viewDate.getFullYear();
  };

  const displayDate = selectedDate ? new Date(selectedDate).toLocaleDateString('id-ID', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  }) : (placeholder || "Pilih Tanggal");

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(viewDate);
    const startDay = firstDayOfMonth(viewDate);

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    for (let day = 1; day <= totalDays; day++) {
      const disabledDay = isDateDisabled(day);
      const selected = isSelected(day);

      days.push(
        <button
          key={day}
          disabled={disabledDay}
          onClick={() => handleDateClick(day)}
          className={`h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
            ${selected
              ? 'bg-red-600 text-white shadow-md shadow-red-200 transform scale-105'
              : disabledDay
                ? 'text-gray-300 cursor-not-allowed bg-gray-50'
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
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
            group flex items-center gap-3 w-full h-[54px] px-4 rounded-2xl transition-all border
            ${disabled
            ? "bg-gray-100 border-gray-100 cursor-not-allowed opacity-60"
            : isOpen
              ? "bg-white border-red-500 shadow-red-100 ring-2 ring-red-100 cursor-pointer"
              : "bg-gray-50 border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-sm cursor-pointer"
          }
        `}
      >
        <span className={`text-xl transition-colors ${disabled ? "text-gray-400" : isOpen || selectedDate ? "text-red-500" : "text-gray-400 group-hover:text-red-500"}`}>
          <FiCalendar />
        </span>
        <div className="flex-1 min-w-0">
          <p className={`text-base font-bold truncate ${selectedDate ? "text-gray-900" : "text-gray-400"}`}>
            {displayDate}
          </p>
        </div>
        {!disabled && (
          <FiChevronDown className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        )}
      </div>
      {isOpen && !disabled && (
        <div
          className={`absolute top-full mt-2 w-[340px] bg-white rounded-2xl shadow-xl z-50 p-5 border border-gray-100 ring-1 ring-black ring-opacity-5 select-none animate-in fade-in zoom-in-95 duration-200 ${popoverAlign === 'right' ? 'right-0' : 'left-0'
            }`}
        >
          <div className="flex justify-between items-center mb-5">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-red-50 rounded-full text-gray-500 hover:text-red-600 transition-colors">
              <FiChevronLeft size={20} />
            </button>
            <span className="font-black text-gray-800 text-lg">
              {viewDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={handleNextMonth} className="p-2 hover:bg-red-50 rounded-full text-gray-500 hover:text-red-600 transition-colors">
              <FiChevronRight size={20} />
            </button>
          </div>
          <div className="grid grid-cols-7 mb-3">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
              <div key={d} className="h-8 flex items-center justify-center text-xs font-bold text-gray-400 uppercase tracking-wide">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1 place-items-center">
            {renderCalendarDays()}
          </div>
          {minDate && (
            <div className="mt-4 pt-4 border-t border-gray-100 text-[11px] text-gray-400 text-center font-medium">
              *Tanggal sebelum hari ini tidak tersedia
            </div>
          )}
        </div>
      )}
    </div>
  );
};