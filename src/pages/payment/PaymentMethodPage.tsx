/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiLoader } from "react-icons/fi";

// Components
import { PaymentMethodList } from "../../components/features/payment/PaymentMethodList";
import { PaymentTotalCard } from "../../components/features/payment/PaymentTotalCard";
import { FlightSummaryCard } from "../../components/features/payment/FlightSummaryCard";
import { SimplePaymentNavbar } from "../../components/layout/SimplePaymentNavbar";

// Services & Types
import { bookingService } from "../../services/bookingService";
import { paymentService } from "../../services/paymentService";
import { Booking } from "../../types/booking";
import { PaymentType } from "../../data/paymentStaticData";
import { BackendPaymentType } from "../../types/payment";

export const PaymentMethodPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // --- 1. STATE INITIALIZATION ---
    // Optimistic Data dari halaman sebelumnya (agar Timer & Harga langsung muncul)
    const initialExpiry = location.state?.expiryTime;
    const initialAmount = location.state?.totalAmount;

    // Data Booking Lengkap (untuk Flight Summary)
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    // Payment Selection State
    const [selectedMethodCode, setSelectedMethodCode] = useState<string | null>(null);
    const [selectedMethodType, setSelectedMethodType] = useState<BackendPaymentType | null>(null);
    const [processing, setProcessing] = useState(false);

    // --- 2. FETCH BOOKING DETAILS ---
    useEffect(() => {
        if (!orderId) {
            navigate("/");
            return;
        }

        const fetchBooking = async () => {
            try {
                // TODO: Idealnya backend punya endpoint GET /bookings/:id
                // Workaround: Ambil dari history list
                const allBookings = await bookingService.getMyBookings();
                
                // Match by order_id (Prioritas) atau booking_code
                const found = allBookings.find(b => b.order_id === orderId || b.booking_code === orderId);
                
                if (found) {
                    setBooking(found);
                } else {
                    console.error("Booking not found in history");
                    // alert("Pesanan tidak ditemukan");
                    // navigate("/");
                }
            } catch (err) {
                console.error("Failed to fetch booking details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [orderId, navigate]);

    // --- 3. HANDLERS ---

    // Handle User Pilih Metode (Menerima Code & Type)
    const handleSelectMethod = (code: string, type: PaymentType) => {
        setSelectedMethodCode(code);
        setSelectedMethodType(type as BackendPaymentType);
    };

    // Handle Klik Bayar
    const handlePay = async () => {
        if (!selectedMethodCode || !selectedMethodType || !orderId) return;
        setProcessing(true);

        try {
            // Call API Backend
            const response = await paymentService.initiatePayment({
                order_id: orderId,
                payment_method: selectedMethodCode,
                payment_type: selectedMethodType
            });

            console.log("Initiate Payment Success:", response);

            // Redirect ke Waiting Page
            // Bawa response payment (VA, QR, dll) dan Expiry Time
            navigate(`/payment/${orderId}/waiting`, {
                state: {
                    paymentData: response,
                    expiryTime: response.expiry_time 
                }
            });

        } catch (error: any) {
            console.error("Payment Error:", error);
            const msg = error.response?.data?.message || "Gagal memproses pembayaran";
            alert(msg);
        } finally {
            setProcessing(false);
        }
    };

    // --- 4. RENDER HELPERS ---
    
    // Gunakan data dari booking (fetch) jika ada, fallback ke state location
    const displayAmount = booking ? parseFloat(booking.total_amount) : (initialAmount ? parseFloat(initialAmount) : 0);
    const displayExpiry = booking?.expiry_time || initialExpiry;

    // Loading State Full Page hanya jika tidak ada data sama sekali
    if (loading && !booking && !initialExpiry) {
        return <div className="min-h-screen flex items-center justify-center"><FiLoader className="animate-spin text-2xl" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Navbar dengan Strict Expiry Timer */}
            <SimplePaymentNavbar expiryTime={displayExpiry} />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-24">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">

                    {/* KOLOM KIRI: PILIH METODE */}
                    <div className="space-y-6">
                        {/* 1. Header Mobile Only (Optional) */}
                        <div className="md:hidden">
                            <h1 className="text-xl font-bold text-gray-900">Pembayaran</h1>
                            <p className="text-sm text-gray-500">Order ID: {orderId}</p>
                        </div>

                        {/* 2. List Metode Pembayaran */}
                        <PaymentMethodList
                            selectedMethod={selectedMethodCode}
                            onSelectMethod={handleSelectMethod}
                        />

                        {/* 3. Total & Tombol Bayar */}
                        <PaymentTotalCard
                            totalAmount={displayAmount}
                            selectedMethod={selectedMethodCode}
                            onPay={handlePay}
                            loading={processing}
                        />
                    </div>

                    {/* KOLOM KANAN: FLIGHT SUMMARY (Sticky) */}
                    <div className="order-first md:order-last">
                        <div className="md:sticky md:top-24">
                            {booking ? (
                                <FlightSummaryCard booking={booking} />
                            ) : (
                                // Skeleton Loading untuk Card Summary
                                <div className="bg-white border border-gray-200 rounded-xl p-4 h-64 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                                    <div className="h-20 bg-gray-100 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};