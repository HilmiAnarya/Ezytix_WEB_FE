/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
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
import { PaymentType, InitiatePaymentRequest } from "../../types/payment";

export const PaymentMethodPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // --- 1. STATE INITIALIZATION ---
    // [TETAP] Expiry time diambil dari state awal (agar visual timer tidak reset/berubah)
    const initialExpiry = location.state?.expiryTime;

    // Data Booking
    const [bookings, setBookings] = useState<Booking[]>([]);
    
    // [TETAP] State total harga Roundtrip
    const [calculatedTotalBooking, setCalculatedTotalBooking] = useState<number>(0);
    
    // [BARU - INJECTED] State untuk menandai jika ada payment pending (Logic Ganti Metode)
    const [hasPendingPayment, setHasPendingPayment] = useState(false);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Selection
    const [selectedMethodCode, setSelectedMethodCode] = useState<string>("");
    const [selectedMethodType, setSelectedMethodType] = useState<PaymentType | "">("");

    // --- 2. FETCH DATA ---
    useEffect(() => {
        if (!orderId) {
            navigate("/");
            return;
        }

        const fetchData = async () => {
            try {
                // A. Fetch Booking (LOGIC LAMA - TIDAK DIUBAH)
                const allBookings = await bookingService.getMyBookings();
                // Filter Booking (Roundtrip Support)
                const relatedBookings = allBookings.filter(b => b.order_id === orderId);
                
                if (relatedBookings.length > 0) {
                    setBookings(relatedBookings);
                    
                    // Hitung Total Harga
                    const totalSum = relatedBookings.reduce((sum, item) => sum + Number(item.total_amount), 0);
                    setCalculatedTotalBooking(totalSum);

                    // B. [LOGIC BARU - INJECTED] Cek Status Payment
                    // Mengecek apakah user ini "Balik Kanan" dari Waiting Page (punya transaksi pending)
                    try {
                        const payRes = await paymentService.getPaymentByOrderId(orderId);
                        if (payRes && (payRes.data.transaction_status === 'pending' || payRes.data.transaction_status === 'waiting')) {
                            // Tandai bahwa ada transaksi yang perlu di-cancel sebelum buat baru
                            setHasPendingPayment(true);
                        }
                    } catch (err) {
                        // Ignore 404 (Belum ada payment)
                        setHasPendingPayment(false);
                    }

                } else {
                    console.error("Booking not found");
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [orderId, navigate]);

    // --- 3. DERIVED DATA ---
    // [TETAP] Logic Display Amount
    const displayAmount = useMemo(() => {
        if (calculatedTotalBooking > 0) return calculatedTotalBooking;
        if (location.state?.totalAmount) return Number(location.state.totalAmount);
        return 0;
    }, [calculatedTotalBooking, location.state]);

    // [TETAP] Logic Display Expiry (Mengutamakan initialExpiry sesuai request)
    const displayExpiry = initialExpiry || (bookings.length > 0 ? bookings[0].expiry_time : undefined);

    // --- 4. HANDLERS ---
    const handleSelectMethod = (methodCode: string, methodType: PaymentType) => {
        setSelectedMethodCode(methodCode);
        setSelectedMethodType(methodType);
    };

    const handlePay = async () => {
        if (!selectedMethodCode || !selectedMethodType || !orderId) {
            alert("Pilih metode pembayaran terlebih dahulu");
            return;
        }

        setProcessing(true);
        try {
            // [CORE LOGIC COMPATIBILITY]
            // WAJIB: Selesaikan cancel sebelum initiate agar Midtrans tidak menolak Order ID yang sama
            if (hasPendingPayment) {
                try {
                    console.log("🔄 Cancelling old transaction in Midtrans...");
                    await paymentService.cancelPayment(orderId);
                    // Setelah sukses cancel, kita set ke false agar tidak cancel berulang jika klik ulang
                    setHasPendingPayment(false); 
                } catch (cancelError) {
                    console.warn("⚠️ Cancel failed or already cleared, attempting to initiate new payment anyway.");
                }
            }

            const payload: InitiatePaymentRequest = {
                order_id: orderId,
                payment_type: selectedMethodType,
            };
            if (selectedMethodType === 'bank_transfer') {
                payload.bank = selectedMethodCode;
            }

            // Create New Transaction (Akan menghasilkan Transaction ID baru di Backend)
            const response = await paymentService.initiatePayment(payload);

            navigate(`/payment/${orderId}/waiting`, {
                state: {
                    paymentData: response, 
                    bookingData: bookings,
                    expiryTime: displayExpiry // Teruskan expiry time asli ke waiting page
                }
            });

        } catch (error: any) {
            console.error("Payment initiation failed:", error);
            alert(error.response?.data?.message || "Gagal memproses pembayaran");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><FiLoader className="animate-spin text-3xl text-blue-600"/></div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Navbar Timer TETAP MENGGUNAKAN LOGIC LAMA */}
            <SimplePaymentNavbar expiryTime={displayExpiry}/>
            
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* KOLOM KIRI: PILIH METODE */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="md:hidden">
                            <h1 className="text-xl font-bold text-gray-900">Pembayaran</h1>
                            <p className="text-sm text-gray-500">Order ID: {orderId}</p>
                        </div>

                        <PaymentMethodList 
                            selectedMethodCode={selectedMethodCode}
                            onSelectMethod={handleSelectMethod}
                        />
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
                            {/* [TETAP] Pass bookings array */}
                            {bookings.length > 0 && <FlightSummaryCard bookings={bookings} />}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};