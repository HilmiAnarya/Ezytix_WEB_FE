
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiLoader, FiArrowLeft } from "react-icons/fi";

// Components
import { PaymentInfoCard } from "../../components/features/payment/PaymentInfoCard";
import { PaymentInstructionList } from "../../components/features/payment/PaymentInstructionList";
import { FlightSummaryCard } from "../../components/features/payment/FlightSummaryCard";
import { SimplePaymentNavbar } from "../../components/layout/SimplePaymentNavbar";

// Services & Data
import { bookingService } from "../../services/bookingService";
import { PAYMENT_INSTRUCTION_DATA } from "../../data/PaymentInstructionData";
import { Booking } from "../../types/booking";
import { InitiatePaymentResponse } from "../../types/payment";

export const PaymentWaitingPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // --- 1. SESSION STORAGE LOGIC ---
    const SESSION_KEY = `payment_session_${orderId}`;

    const loadInitialData = (): InitiatePaymentResponse | undefined => {
        if (location.state?.paymentData) {
            const data = location.state.paymentData;
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
            return data;
        }
        const saved = sessionStorage.getItem(SESSION_KEY);
        return saved ? JSON.parse(saved) : undefined;
    };

    const [paymentData] = useState<InitiatePaymentResponse | undefined>(loadInitialData);
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loadingBooking, setLoadingBooking] = useState(true);

    // --- 2. POLLING STATUS PEMBAYARAN (FIXED 404) ---
    useEffect(() => {
        if (!orderId) return;

        let isMounted = true;
        
        const fetchStatus = async () => {
            try {
                // [FIX] Gunakan getMyBookings() seperti di PaymentMethodPage
                // Karena endpoint GET /bookings/:id ternyata 404
                const allBookings = await bookingService.getMyBookings();
                
                // Filter manual di sisi client
                const foundBooking = allBookings.find(b => b.order_id === orderId || b.booking_code === orderId);
                
                if (isMounted && foundBooking) {
                    setBooking(foundBooking);
                    setLoadingBooking(false);

                    // Auto-Redirect jika sudah paid
                    if (foundBooking.status === 'paid') {
                        navigate('/booking/success', { replace: true });
                    }
                } else if (isMounted && !foundBooking) {
                    console.warn("Booking not found in history list");
                }

            } catch (error) {
                console.error("Polling error:", error);
            }
        };

        // Fetch pertama kali segera
        fetchStatus();

        // Polling setiap 5 detik
        const interval = setInterval(fetchStatus, 5000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [orderId, navigate]);

    // --- 3. DERIVED DATA FOR UI ---
    
    // A. Tentukan Payment Key (BCA, MANDIRI, dll)
    const instructionKey = useMemo(() => {
        if (!paymentData) return "";
        if (paymentData.mandiri_bill) return "MANDIRI";
        if (paymentData.virtual_account) return paymentData.virtual_account.bank.toUpperCase();
        if (paymentData.qris) return "QRIS";
        return "";
    }, [paymentData]);

    // B. Ambil Payment Code
    const displayPaymentCode = useMemo(() => {
        if (!paymentData) return "";
        if (paymentData.virtual_account) return paymentData.virtual_account.va_number;
        if (paymentData.mandiri_bill) return paymentData.mandiri_bill.bill_key;
        return "";
    }, [paymentData]);

    // C. Ambil Biller Code (Mandiri)
    const displayBillerCode = paymentData?.mandiri_bill?.biller_code;

    // --- 4. RENDER ---
    
    if (!paymentData && !loadingBooking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-gray-500 mb-4">Data sesi pembayaran berakhir.</p>
                <button 
                    onClick={() => navigate(`/payment/${orderId}/select`)}
                    className="text-red-600 font-semibold hover:underline"
                >
                    Ulangi Pemilihan Metode Pembayaran
                </button>
            </div>
        );
    }

    // Gunakan expiry dari booking (yang baru di-fetch) atau paymentData
    const finalExpiryTime = booking?.expiry_time || paymentData?.expiry_time || new Date().toISOString();
    const finalAmount = booking ? parseFloat(booking.total_amount) : (paymentData ? Number(paymentData.amount) : 0);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <SimplePaymentNavbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-24">
                
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <FiArrowLeft /> Kembali
                </button>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">

                    {/* KOLOM KIRI: Info & Instruksi */}
                    <div className="space-y-8">
                        <PaymentInfoCard
                            orderId={orderId || "-"}
                            bookingDate={booking?.created_at || new Date().toISOString()}
                            amount={finalAmount}
                            status={booking?.status || "pending"}
                            expiryTime={finalExpiryTime}
                            paymentMethodName={instructionKey}
                            paymentData={paymentData} 
                        />

                        {instructionKey && PAYMENT_INSTRUCTION_DATA[instructionKey] ? (
                            <PaymentInstructionList
                                instructions={PAYMENT_INSTRUCTION_DATA[instructionKey]}
                                paymentCode={displayPaymentCode}
                                billerCode={displayBillerCode}
                            />
                        ) : null}
                    </div>

                    {/* KOLOM KANAN: Flight Summary (Sticky) */}
                    <div className="order-first md:order-last">
                        <div className="md:sticky md:top-24">
                            {booking ? (
                                <FlightSummaryCard booking={booking} />
                            ) : (
                                <div className="bg-white border border-gray-200 rounded-xl p-6 h-64 flex items-center justify-center">
                                    <FiLoader className="animate-spin text-gray-300 text-3xl" />
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};