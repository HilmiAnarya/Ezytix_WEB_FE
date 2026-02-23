/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from "react";
import { HistoryNavbar } from "../components/layout/HistoryNavbar";
import { PendingBookingCard } from "../components/features/history/PendingBookingCard";
import { ActiveBookingCard } from "../components/features/history/ActiveBookingCard";
import { HistoryBookingCard } from "../components/features/history/HistoryBookingCard";
import { bookingService } from "../services/bookingService";
import { Booking } from "../types/booking";
import { FiInbox, FiRefreshCw } from "react-icons/fi";

export const BookingHistoryPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await bookingService.getMyBookings();
        setBookings(Array.isArray(data) ? data : []); 
      } catch (err: any) {
        console.error("Gagal mengambil riwayat:", err);
        setError("Gagal memuat riwayat pemesanan. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const { pendingBookings, activeBookings, historyBookings } = useMemo(() => {
    const safeBookings = bookings || []; 
    const pending = safeBookings.filter((b) => b.status === "pending");
    const active = safeBookings.filter((b) => b.status === "paid");
    const history = safeBookings.filter((b) => 
      ["cancelled", "expired", "failed"].includes(b.status)
    );

    return { 
      pendingBookings: pending, 
      activeBookings: active, 
      historyBookings: history 
    };
  }, [bookings]);

  const isEmpty = bookings?.length === 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <FiRefreshCw className="animate-spin text-3xl text-red-600" />
        <p className="text-gray-500 font-medium">Memuat riwayat pemesanan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 font-bold">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <HistoryNavbar />

      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-28 pb-10">
        {pendingBookings.length > 0 && (
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
              Pembelian Tertunda
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {pendingBookings.length}
              </span>
            </h2>
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <PendingBookingCard key={booking.booking_code} data={booking} />
              ))}
            </div>
          </div>
        )}

        {activeBookings.length > 0 && (
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              E-Tiket Aktif
            </h2>
            <div className="space-y-4">
              {activeBookings.map((booking) => (
                <ActiveBookingCard key={booking.booking_code} data={booking} />
              ))}
            </div>
          </div>
        )}

        {historyBookings.length > 0 && (
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Riwayat Pemesanan
            </h2>
            <div className="space-y-4">
              {historyBookings.map((booking) => (
                <HistoryBookingCard key={booking.booking_code} data={booking} />
              ))}
            </div>
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <div className="bg-gray-200 p-6 rounded-full mb-4">
              <FiInbox className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Belum ada riwayat</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">
              Kamu belum melakukan pemesanan tiket apapun. Yuk cari tiket sekarang!
            </p>
          </div>
        )}

      </div>
    </div>
  );
};