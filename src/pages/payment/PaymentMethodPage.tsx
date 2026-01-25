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
// [FIX] Import Type yang benar dari hasil refactor Phase 1
import { PaymentType, InitiatePaymentRequest } from "../../types/payment";

export const PaymentMethodPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // --- 1. STATE INITIALIZATION ---
    const initialExpiry = location.state?.expiryTime;
    const initialAmount = location.state?.totalAmount;

    // Data Booking
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    // Payment Selection State
    const [selectedMethodCode, setSelectedMethodCode] = useState<string | null>(null);
    // [FIX] Gunakan tipe 'PaymentType' agar match dengan PaymentMethodList
    const [selectedMethodType, setSelectedMethodType] = useState<PaymentType | null>(null);
    const [processing, setProcessing] = useState(false);

    // --- 2. FETCH BOOKING DETAILS ---
    useEffect(() => {
        if (!orderId) {
            navigate("/");
            return;
        }

        const fetchBooking = async () => {
            try {
                // Fetch history untuk mencari booking ini
                // Idealnya: endpoint GET /bookings/:id
                const allBookings = await bookingService.getMyBookings();
                
                const found = allBookings.find(b => b.order_id === orderId || b.booking_code === orderId);
                
                if (found) {
                    setBooking(found);
                } else {
                    console.error("Booking not found in history");
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

    // Handle User Pilih Metode
    const handleSelectMethod = (code: string, type: PaymentType) => {
        setSelectedMethodCode(code);
        setSelectedMethodType(type);
    };

    // [CRITICAL LOGIC] Handle Klik Bayar
    const handlePay = async () => {
        if (!selectedMethodCode || !selectedMethodType || !orderId) return;
        setProcessing(true);

        try {
            // A. Siapkan Payload Dasar
            const payload: InitiatePaymentRequest = {
                order_id: orderId,
                payment_type: selectedMethodType
            };

            // B. Conditional Field Logic (Midtrans Core API)
            // Backend kita: Jika bank_transfer, butuh field 'bank'
            // Jika echannel (Mandiri), TIDAK butuh field 'bank' (sudah implied echannel)
            // Jika qris, TIDAK butuh field 'bank'
            
            if (selectedMethodType === 'bank_transfer') {
                payload.bank = selectedMethodCode; // 'bca', 'bni', 'bri', 'permata'
            } 
            
            console.log("🚀 Payload to Backend:", payload);

            // C. Call API Backend
            const response = await paymentService.initiatePayment(payload);

            console.log("✅ Initiate Payment Success:", response);

            // D. Redirect ke Waiting Page
            // Kita bawa paymentData response (berisi VA number / QR string) ke halaman sebelah
            navigate(`/payment/${orderId}/waiting`, {
                state: {
                    paymentData: response,
                    expiryTime: response.expiry_time 
                }
            });

        } catch (error: any) {
            console.error("Payment Error:", error);
            const msg = error.response?.data?.message || "Gagal memproses pembayaran";
            alert(`Gagal Bayar: ${msg}`);
        } finally {
            setProcessing(false);
        }
    };

    // --- 4. RENDER HELPERS ---
    
    // Gunakan data dari booking (fetch) jika ada, fallback ke state location
    const displayAmount = booking ? parseFloat(booking.total_amount) : (initialAmount ? parseFloat(initialAmount) : 0);
    const displayExpiry = booking?.expiry_time || initialExpiry;

    if (loading && !booking && !initialExpiry) {
        return <div className="min-h-screen flex items-center justify-center"><FiLoader className="animate-spin text-2xl" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <SimplePaymentNavbar expiryTime={displayExpiry} />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-24">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">

                    {/* KOLOM KIRI: PILIH METODE */}
                    <div className="space-y-6">
                        <div className="md:hidden">
                            <h1 className="text-xl font-bold text-gray-900">Pembayaran</h1>
                            <p className="text-sm text-gray-500">Order ID: {orderId}</p>
                        </div>

                        {/* [FIX] Props Name Updated: selectedMethodCode */}
                        <PaymentMethodList
                            selectedMethodCode={selectedMethodCode}
                            onSelectMethod={handleSelectMethod}
                        />

                        {/* Total & Tombol Bayar */}
                        <PaymentTotalCard
                            totalAmount={displayAmount}
                            selectedMethod={selectedMethodCode}
                            onPay={handlePay}
                            loading={processing}
                        />
                    </div>

                    {/* KOLOM KANAN: FLIGHT SUMMARY */}
                    <div className="order-first md:order-last">
                        <div className="md:sticky md:top-24">
                            {booking ? (
                                <FlightSummaryCard booking={booking} />
                            ) : (
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