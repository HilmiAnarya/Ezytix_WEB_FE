import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PaymentInfoCard } from "../../components/features/payment/PaymentInfoCard";
import { PaymentInstructionList } from "../../components/features/payment/PaymentInstructionList";
import { FlightSummaryCard } from "../../components/features/payment/FlightSummaryCard";
import { bookingService } from "../../services/bookingService";
import { Booking } from "../../types/booking";
import { FiLoader, FiArrowLeft } from "react-icons/fi";
import { SimplePaymentNavbar } from "../../components/layout/SimplePaymentNavbar";

// Dummy Data Instruksi (Nanti pindah ke paymentStaticData.ts)
const DUMMY_INSTRUCTIONS = [
    {
        title: "ATM BCA",
        steps: [
            "Masukkan Kartu ATM BCA & PIN",
            "Pilih Menu Transaksi Lainnya > Transfer > ke Rekening BCA Virtual Account",
            "Masukkan nomor Virtual Account yang tertera",
            "Periksa detail pembayaran, lalu tekan Benar",
            "Transaksi selesai, simpan bukti pembayaran"
        ]
    },
    {
        title: "m-BCA (BCA Mobile)",
        steps: [
            "Login ke aplikasi m-BCA",
            "Pilih menu m-Transfer > BCA Virtual Account",
            "Masukkan nomor Virtual Account",
            "Masukkan PIN m-BCA",
            "Pembayaran berhasil"
        ]
    },
    {
        title: "KlikBCA (Internet Banking)",
        steps: [
            "Login ke KlikBCA Individual",
            "Pilih menu Transfer Dana > Transfer ke BCA Virtual Account",
            "Masukkan nomor Virtual Account",
            "Lanjutkan proses otorisasi dengan KeyBCA"
        ]
    }
];

export const PaymentWaitingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data Booking
  useEffect(() => {
    const fetchBooking = async () => {
        try {
            // Simulasi fetch (Nanti ganti real API getBookingById)
            const allBookings = await bookingService.getMyBookings(); 
            const found = allBookings.find(b => b.booking_code === orderId);
            if (found) setBooking(found);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchBooking();
  }, [orderId]);

  // 2. Polling Status (Cek apakah sudah lunas)
  useEffect(() => {
      const interval = setInterval(async () => {
          // TODO: Panggil API cek status payment
          // const status = await paymentService.checkStatus(orderId);
          // if (status === 'PAID') navigate('/booking/success');
          console.log("Polling payment status...");
      }, 5000); // Cek tiap 5 detik

      return () => clearInterval(interval);
  }, [orderId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><FiLoader className="animate-spin text-2xl"/></div>;
  if (!booking) return <div className="min-h-screen flex items-center justify-center">Booking tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SimplePaymentNavbar/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pt-24">
        
        {/* Back Button (Optional) */}
        <button 
            onClick={() => navigate(`/payment/${orderId}/select`)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
            <FiArrowLeft /> Ganti Metode Pembayaran
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
          
          {/* KOLOM KIRI: INFO VA & INSTRUKSI */}
          <div className="space-y-6">
            <PaymentInfoCard 
                orderId={booking.booking_code}
                amount={parseFloat(booking.total_amount)}
                // Expiry Time Dummy (1 jam dari sekarang)
                expiryTime={new Date(Date.now() + 60 * 60 * 1000).toISOString()} 
                vaNumber="700010812345678" // Dummy VA
                bankCode="BCA" // Dummy Bank
            />
            
            <PaymentInstructionList instructions={DUMMY_INSTRUCTIONS} />
          </div>

          {/* KOLOM KANAN: SUMMARY (Sticky) */}
          <div className="order-first md:order-last">
            <div className="md:sticky md:top-24">
              <FlightSummaryCard booking={booking} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};