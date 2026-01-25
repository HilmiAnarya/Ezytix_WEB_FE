import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiLoader, FiArrowLeft } from "react-icons/fi";

// Components (Sudah di-refactor di Step 3.3.1 & 3.3.2)
import { PaymentInfoCard } from "../../components/features/payment/PaymentInfoCard";
import { PaymentInstructionList } from "../../components/features/payment/PaymentInstructionList";
import { FlightSummaryCard } from "../../components/features/payment/FlightSummaryCard";
import { SimplePaymentNavbar } from "../../components/layout/SimplePaymentNavbar";

// Services & Data
import { bookingService } from "../../services/bookingService";
import { PAYMENT_INSTRUCTION_DATA } from "../../data/PaymentInstructionData";
import { Booking } from "../../types/booking";
// [FIX] Gunakan type yang benar
import { InitiatePaymentResponse } from "../../types/payment";

export const PaymentWaitingPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // --- 1. SESSION STORAGE LOGIC (SOLUSI REFRESH PAGE) ---
    // Agar data payment (VA/QR) tidak hilang saat user refresh halaman
    const SESSION_KEY = `payment_session_${orderId}`;

    const loadInitialData = (): InitiatePaymentResponse | undefined => {
        // Prioritas 1: Ambil dari State navigasi (Fresh dari halaman sebelumnya)
        if (location.state?.paymentData) {
            const data = location.state.paymentData;
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
            return data;
        }
        // Prioritas 2: Ambil dari Session Storage (Jika user refresh)
        const saved = sessionStorage.getItem(SESSION_KEY);
        return saved ? JSON.parse(saved) : undefined;
    };

    const [paymentData] = useState<InitiatePaymentResponse | undefined>(loadInitialData);
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loadingBooking, setLoadingBooking] = useState(true);

    // --- 2. POLLING STATUS PEMBAYARAN ---
    useEffect(() => {
        if (!orderId) return;

        let isMounted = true;
        const fetchStatus = async () => {
            try {
                // [OPTIMIZATION] Gunakan getBookingByOrderId (Step 2.1)
                // Jangan fetch semua history, cukup satu order ini saja.
                const updatedBooking = await bookingService.getBookingByOrderId(orderId);
                
                if (isMounted) {
                    setBooking(updatedBooking);
                    setLoadingBooking(false);

                    // Auto-Redirect jika sudah paid
                    if (updatedBooking.status === 'paid') {
                        navigate('/booking/success', { replace: true });
                    }
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

    // --- 3. DERIVED DATA FOR UI (LOGIC MAPPING) ---
    
    // A. Tentukan Payment Key untuk Instruksi (BCA, MANDIRI, BRI, dll)
    const instructionKey = useMemo(() => {
        if (!paymentData) return "";

        // Case Mandiri Bill (E-Channel)
        if (paymentData.mandiri_bill) return "MANDIRI";

        // Case Virtual Account (Ambil bank-nya)
        if (paymentData.virtual_account) {
            return paymentData.virtual_account.bank.toUpperCase(); // "bca" -> "BCA"
        }

        // Case QRIS (Biasanya tidak butuh instruksi kompleks, tapi kita sediakan key)
        if (paymentData.qris) return "QRIS"; // Pastikan ada di data static jika mau ditampilkan

        return "";
    }, [paymentData]);

    // B. Ambil Payment Code (VA Number atau Bill Key)
    const displayPaymentCode = useMemo(() => {
        if (!paymentData) return "";
        if (paymentData.virtual_account) return paymentData.virtual_account.va_number;
        if (paymentData.mandiri_bill) return paymentData.mandiri_bill.bill_key;
        return "";
    }, [paymentData]);

    // C. Ambil Biller Code (Khusus Mandiri)
    const displayBillerCode = paymentData?.mandiri_bill?.biller_code;

    // --- 4. RENDER ---
    
    // Safety check jika data hilang sama sekali
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

    // Gunakan expiry time dari payment response (priority) atau booking data
    const finalExpiryTime = paymentData?.expiry_time || booking?.expiry_time || new Date().toISOString();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <SimplePaymentNavbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-24">
                
                {/* Back Button (Mobile only logic sometimes) */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <FiArrowLeft /> Kembali
                </button>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">

                    {/* KOLOM KIRI: Payment Info & Instruksi */}
                    <div className="space-y-8">
                        
                        {/* 1. Payment Info Card (VA / QR Display) */}
                        <PaymentInfoCard
                            orderId={orderId || "-"}
                            bookingDate={booking?.created_at || new Date().toISOString()}
                            amount={parseFloat(paymentData?.amount?.toString() || booking?.total_amount || "0")}
                            status={booking?.status || "pending"}
                            expiryTime={finalExpiryTime}
                            paymentMethodName={instructionKey} // Label header
                            
                            // [CRITICAL] Pass full object ke komponen refactor Step 3.3.1
                            paymentData={paymentData} 
                        />

                        {/* 2. Instruction List (Accordion) */}
                        {instructionKey && PAYMENT_INSTRUCTION_DATA[instructionKey] ? (
                            <PaymentInstructionList
                                instructions={PAYMENT_INSTRUCTION_DATA[instructionKey]}
                                
                                // [CRITICAL] Props untuk komponen refactor Step 3.3.2
                                paymentCode={displayPaymentCode}
                                billerCode={displayBillerCode}
                            />
                        ) : (
                            // Fallback jika tidak ada instruksi (misal QRIS scan only)
                            null 
                        )}
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