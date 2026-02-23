/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { FiChevronDown, FiDownload, FiArrowRight, FiCheckCircle, FiFileText } from "react-icons/fi";
import { Booking } from "../../../types/booking";
import { bookingService } from "../../../services/bookingService";
import { downloadBlob } from "../../../utils/downloadHelper";

interface Props {
  data: Booking;
}

export const ActiveBookingCard: React.FC<Props> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);
  const [isDownloadingTicket, setIsDownloadingTicket] = useState(false);

  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  };

  const handleDownloadInvoice = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!data.order_id) return;
    
    setIsDownloadingInvoice(true);
    try {
      const blob = await bookingService.downloadInvoice(data.order_id);
      downloadBlob(blob, `Invoice-${data.order_id}.pdf`);
    } catch (error) {
      console.error("Gagal download invoice", error);
      alert("Gagal mengunduh invoice. Silakan coba lagi.");
    } finally {
      setIsDownloadingInvoice(false);
    }
  };

  const handleDownloadTicket = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!data.booking_code) return;

    setIsDownloadingTicket(true);
    try {
      const blob = await bookingService.downloadEticket(data.booking_code);
      downloadBlob(blob, `Eticket-${data.booking_code}.pdf`);
    } catch (error) {
      console.error("Gagal download tiket", error);
      alert("Gagal mengunduh E-Ticket.");
    } finally {
      setIsDownloadingTicket(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}j ${m}m`;
  };

  const getCode = (location: string) => {
    const match = location.match(/\(([^)]+)\)/);
    return match ? match[1] : location.substring(0, 3).toUpperCase();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-4 overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col md:flex-row items-stretch">
        <div
          className="flex-1 flex items-center gap-5 p-5 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-14 h-14 flex-shrink-0 bg-white rounded-full border border-gray-100 flex items-center justify-center p-2 shadow-sm">
            <img
              src={data.flight.airline_logo}
              alt={data.flight.airline_name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-900 text-[15px]">
                  {data.flight.airline_name}
                </span>
                <span className="text-gray-300">|</span>
                <span className="font-medium text-gray-900 text-[15px]">
                  {data.flight.flight_code}
                </span>
              </div>
              <p className="text-[15px] font-medium text-gray-900">
                {formatTime(data.flight.departure_time)}
              </p>
              <p className="text-[11px] text-gray-500">
                {formatDate(data.flight.departure_time)}
              </p>
              <p className="text-[11px] text-gray-500">
                {getCode(data.flight.origin)}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center pt-6">
              <p className="text-[13px] font-medium text-gray-900">
                {formatDuration(data.flight.duration_minutes)}
              </p>
              <p className="text-[11px] text-gray-500">Langsung</p>
            </div>
            <div className="flex flex-col items-end pt-6">
              <p className="text-[15px] font-medium text-gray-900">
                {formatTime(data.flight.arrival_time)}
              </p>
              <p className="text-[11px] text-gray-500">
                {formatDate(data.flight.arrival_time)}
              </p>
              <p className="text-[11px] text-gray-500">
                {getCode(data.flight.destination)}
              </p>
            </div>
          </div>
        </div>
        <div className="hidden md:block w-[1px] bg-gray-100 self-stretch my-4"></div>
        <div className="w-full md:w-[140px] flex items-center justify-center p-5">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-red-600 font-medium text-sm hover:underline whitespace-nowrap"
          >
            Lihat Detail
            <FiChevronDown
              className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 animate-in slide-in-from-top-1">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Kode Booking:{" "}
              <span className="font-mono font-bold text-gray-900 text-lg ml-1">
                {data.booking_code}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadInvoice}
                disabled={isDownloadingInvoice}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg shadow-sm transition-all disabled:opacity-50"
              >
                {isDownloadingInvoice ? (
                  <span className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"/>
                ) : (
                  <FiFileText className="w-4 h-4" />
                )}
                Invoice
              </button>
              <button
                onClick={handleDownloadTicket}
                disabled={isDownloadingTicket}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:opacity-50"
              >
                {isDownloadingTicket ? (
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/>
                ) : (
                    <FiDownload className="w-4 h-4" />
                )}
                E-Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 