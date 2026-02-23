import React from "react";
import { FiArrowRight, FiCalendar, FiUser, FiEdit2 } from "react-icons/fi";

interface Props {
  originCode: string;
  originCity: string;
  destinationCode: string;
  destinationCity: string;
  dateFormatted: string;
  passengers: number;
  seatClass: string;
  onEditSearch: () => void;
}

export const SearchSummary: React.FC<Props> = ({
  originCode, originCity, destinationCode, destinationCity,
  dateFormatted, passengers, seatClass, onEditSearch
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3 text-gray-800">
              <div className="flex flex-col text-right">
                <span className="text-base font-bold leading-none">{originCity}</span>
                <span className="text-xs text-gray-500 font-bold bg-gray-100 px-1.5 py-0.5 rounded ml-auto mt-1">{originCode}</span>
              </div>
              <FiArrowRight className="text-gray-400 text-lg" />
              <div className="flex flex-col">
                <span className="text-base font-bold leading-none">{destinationCity}</span>
                <span className="text-xs text-gray-500 font-bold bg-gray-100 px-1.5 py-0.5 rounded mr-auto mt-1">{destinationCode}</span>
              </div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200 mx-4"></div>
            <div className="hidden md:flex gap-3 text-sm text-gray-600 font-medium">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <FiCalendar className="text-red-500" />
                <span>{dateFormatted}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <FiUser className="text-red-500" />
                <span>{passengers} Pax</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="capitalize">{seatClass}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onEditSearch}
            className="w-full md:w-auto px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2"
          >
            <FiEdit2 />
            <span>Ubah</span>
          </button>
        </div>
    </div>
  );
};