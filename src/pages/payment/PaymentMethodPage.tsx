/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PaymentMethodList } from "../../components/features/payment/PaymentMethodList";
import { PaymentTotalCard } from "../../components/features/payment/PaymentTotalCard";
import { FlightSummaryCard } from "../../components/features/payment/FlightSummaryCard";
import { bookingService } from "../../services/bookingService";
import { Booking } from "../../types/booking";
import { FiLoader } from "react-icons/fi";
import { SimplePaymentNavbar } from "../../components/layout/SimplePaymentNavbar";

export const PaymentMethodPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    // 1. Fetch Data Booking (Flight Summary)
    useEffect(() => {
        // Di sini nanti kita panggil API getBookingById(orderId)
        // Sementara kita pakai dummy fetch dari history (karena service getById belum ada di frontend service kita yang baru)
        // TODO: Update bookingService untuk punya getBookingById
        const fetchBooking = async () => {
            try {
                // Simulasi fetch (Nanti ganti real API)
                const allBookings = await bookingService.getMyBookings();
                // Cari manual (sementara)
                const found = allBookings.find(b => b.booking_code === orderId || b.booking_code /* sesuaikan */);
                if (found) setBooking(found);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [orderId]);

    // 2. Handle Bayar
    const handlePay = async () => {
        if (!selectedMethod || !orderId) return;
        setProcessing(true);

        try {
            // TODO: Panggil API Backend /payments/initiate
            // const res = await paymentService.initiate(orderId, selectedMethod);

            console.log("Membayar dengan:", selectedMethod);

            // Simulasi Sukses -> Redirect ke Waiting Page
            setTimeout(() => {
                navigate(`/payment/${orderId}/waiting`);
            }, 1500);

        } catch (err) {
            alert("Gagal memproses pembayaran");
            setProcessing(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><FiLoader className="animate-spin text-2xl" /></div>;
    if (!booking) return <div className="min-h-screen flex items-center justify-center">Booking tidak ditemukan</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <SimplePaymentNavbar/>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-24">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">

                    {/* KOLOM KIRI: PILIH METODE */}
                    <div className="space-y-6">
                        <PaymentMethodList
                            selectedMethod={selectedMethod}
                            onSelectMethod={setSelectedMethod}
                        />

                        {/* Tampilkan Total di Bawah (Mobile) atau Kiri (Desktop) */}
                        <PaymentTotalCard
                            totalAmount={parseFloat(booking.total_amount)}
                            selectedMethod={selectedMethod}
                            onPay={handlePay}
                            loading={processing}
                        />
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