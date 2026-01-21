
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
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
import { InitiatePaymentResponse, PaymentInstructions } from "../../types/payment";

export const PaymentWaitingPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // --- 1. SESSION STORAGE LOGIC (SOLUSI REFRESH PAGE) ---
    // Kita gunakan key unik berdasarkan orderId agar data tidak tertukar antar pesanan
    const SESSION_KEY = `payment_session_${orderId}`;

    // Helper untuk load data awal (State Priority -> Storage Fallback)
    const loadInitialData = (): InitiatePaymentResponse | undefined => {
        if (location.state?.paymentData) {
            return location.state.paymentData;
        }
        const saved = sessionStorage.getItem(SESSION_KEY);
        return saved ? JSON.parse(saved) : undefined;
    };

    // State untuk Payment Data (BCA/Mandiri/dll)
    const [paymentState, setPaymentState] = useState<InitiatePaymentResponse | undefined>(loadInitialData);

    // State untuk Expiry (Bisa dari state navigasi atau booking nanti)
    const [initialExpiry] = useState<string | undefined>(location.state?.expiryTime);

    // Effect: Simpan ke Session Storage jika ada data baru dari location.state
    useEffect(() => {
        if (location.state?.paymentData) {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(location.state.paymentData));
            setPaymentState(location.state.paymentData);
        }
    }, [location.state, SESSION_KEY]);


    // --- 2. DATA PERSISTEN (BOOKING) ---
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch & Polling Logic
    useEffect(() => {
        if (!orderId) return;

        const checkStatus = async () => {
            try {
                const allBookings = await bookingService.getMyBookings();
                const found = allBookings.find(b => b.order_id === orderId || b.booking_code === orderId);

                if (found) {
                    setBooking(found);
                    // Jika sudah PAID, bersihkan session dan redirect
                    if (found.status === 'paid') {
                        sessionStorage.removeItem(SESSION_KEY);
                        navigate('/booking/success');
                    }
                }
            } catch (err) {
                console.error("Polling Error:", err);
            } finally {
                setLoading(false);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 5000);
        return () => clearInterval(interval);

    }, [orderId, navigate, SESSION_KEY]);


    // --- 3. LOGIC TAMPILAN (MERGING) ---

    // A. Expiry Time: State Awal -> Booking DB -> Current
    const displayExpiry = initialExpiry || booking?.expiry_time || new Date().toISOString();

    // B. Payment Method Key
    // SEKARANG AMAN: Ambil dari paymentState (yang sudah di-backup SessionStorage)
    const methodKey = (paymentState?.payment_method || "").toUpperCase();

    // C. Instructions & Details
    const instructions: PaymentInstructions | undefined = PAYMENT_INSTRUCTION_DATA[methodKey];
    const paymentCode = paymentState?.payment_code;
    const qrString = paymentState?.qr_string;

    // --- RENDER ---

    if (loading && !booking && !paymentState) {
        return <div className="min-h-screen flex items-center justify-center"><FiLoader className="animate-spin text-2xl" /></div>;
    }

    // Jika benar-benar kosong (User clear cache / ganti device) -> Baru tampilkan fallback minim
    // Tapi UI tidak berubah drastis, hanya konten kosong.
    const isDataMissing = !methodKey && !booking;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <SimplePaymentNavbar expiryTime={displayExpiry} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pt-24">

                <button
                    onClick={() => navigate(`/payment/${orderId}/select`)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                >
                    <FiArrowLeft /> Ganti Metode Pembayaran
                </button>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">

                    <div className="space-y-6">
                        {/* Payment Info Card */}
                        <PaymentInfoCard
                            orderId={booking?.booking_code || orderId || ""}
                            bookingDate={booking?.created_at || new Date().toISOString()}
                            amount={paymentState?.amount || (booking ? parseFloat(booking.total_amount) : 0)}
                            status={booking?.status || 'pending'}
                            expiryTime={displayExpiry}

                            paymentMethod={methodKey}
                            paymentCode={paymentCode}
                            qrString={qrString}
                        />

                        {/* Instruction List */}
                        {instructions ? (
                            <PaymentInstructionList
                                instructions={instructions}
                                paymentCode={paymentCode}
                            />
                        ) : (
                            // Tampilan sopan jika data instruksi hilang (jarang terjadi dgn session storage)
                            <div className="p-6 bg-white rounded-xl border border-gray-200 text-center shadow-sm">
                                <p className="text-gray-500 mb-4">Detail instruksi tidak dapat dimuat.</p>
                                <button
                                    onClick={() => navigate(`/payment/${orderId}/select`)}
                                    className="text-primary font-semibold hover:underline"
                                >
                                    Muat Ulang Metode Pembayaran
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="order-first md:order-last">
                        <div className="md:sticky md:top-24">
                            {booking ? (
                                <FlightSummaryCard booking={booking} />
                            ) : (
                                <div className="bg-white p-4 rounded-xl animate-pulse h-48"></div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};