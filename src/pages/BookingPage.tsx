/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SimpleNavbar } from "../components/layout/SimpleNavbar";

// Components
import { BookerInfoCard } from "../components/booking/BookerInfoCard";
import { PassengerForm, PassengerData } from "../components/booking/PassengerForm";
import { BookingSidebar } from "../components/booking/BookingSidebar";
import { BookingActionFooter } from "../components/booking/BookingActionFooter";

// Services & Types
import { flightService } from "../services/flightService";
import { bookingService } from "../services/bookingService"; // [NEW]
import { Flight } from "../types/api";
import { CreateBookingRequest, BookingItemPayload, PassengerPayload } from "../types/booking"; // [NEW]

const BookingPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // --- 1. STATE MANAGEMENT ---
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false); // [NEW] Loading tombol bayar
    
    const [outboundFlight, setOutboundFlight] = useState<Flight | null>(null);
    const [inboundFlight, setInboundFlight] = useState<Flight | null>(null);

    // State Penumpang & Validasi
    const [passengersData, setPassengersData] = useState<PassengerData[]>([]);
    const [passengersValidity, setPassengersValidity] = useState<boolean[]>([]);

    // Mock User Data (Idealnya dari Context/Redux)
    const user = {
        fullName: "Hilmi Anarya",
        email: "hilmian@ezytix.com",
        phone: "+62 812 3456 7890"
    };

    // --- 2. INITIAL FETCHING ---
    useEffect(() => {
        const fetchBookingContext = async () => {
            setLoading(true);
            try {
                const outboundId = searchParams.get("outbound_id");
                const inboundId = searchParams.get("inbound_id");
                const passengerCount = Number(searchParams.get("passengers")) || 1;

                if (!outboundId) {
                    alert("Data penerbangan tidak ditemukan!");
                    navigate("/");
                    return;
                }

                const promises = [flightService.getFlightById(Number(outboundId))];
                if (inboundId) {
                    promises.push(flightService.getFlightById(Number(inboundId)));
                }

                const results = await Promise.all(promises);
                
                setOutboundFlight(results[0]);
                if (results[1]) setInboundFlight(results[1]);

                // Init State Form Penumpang
                setPassengersData(new Array(passengerCount).fill(null));
                setPassengersValidity(new Array(passengerCount).fill(false));

            } catch (error) {
                console.error("Error loading booking data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingContext();
    }, [searchParams, navigate]);


    // --- 3. LOGIC & CALCULATIONS ---

    // A. Deteksi Internasional
    const isInternational = useMemo(() => {
        if (!outboundFlight) return false;
        
        // Cek Negara Origin & Destination Outbound
        const isOutboundIntl = 
            outboundFlight.origin.country !== "Indonesia" || 
            outboundFlight.destination.country !== "Indonesia";
        
        let isInboundIntl = false;
        if (inboundFlight) {
            isInboundIntl = 
                inboundFlight.origin.country !== "Indonesia" || 
                inboundFlight.destination.country !== "Indonesia";
        }

        return isOutboundIntl || isInboundIntl;
    }, [outboundFlight, inboundFlight]);

    // B. Kalkulasi Harga
    const { grandTotal } = useMemo(() => {
        const count = passengersData.length;
        const outPrice = parseFloat(outboundFlight?.flight_classes[0]?.price.toString() || "0");
        const inPrice = parseFloat(inboundFlight?.flight_classes[0]?.price.toString() || "0");

        return {
            totalOutbound: outPrice * count,
            totalInbound: inPrice * count,
            grandTotal: (outPrice * count) + (inPrice * count)
        };
    }, [outboundFlight, inboundFlight, passengersData.length]);

    // C. Gatekeeper Validasi
    const isFormValid = useMemo(() => {
        return passengersValidity.length > 0 && passengersValidity.every(v => v === true);
    }, [passengersValidity]);


    // --- 4. DATA TRANSFORMATION (THE BRIDGE) 🌉 ---
    const transformToPayload = (): CreateBookingRequest => {
        const seatClass = searchParams.get("seat_class") || "economy";

        // 1. Mapping Penumpang (Frontend -> Backend DTO)
        const backendPassengers: PassengerPayload[] = passengersData.map(p => {
            // Mapping Title (Mr -> tuan)
            let backendTitle = "tuan"; // Default
            const t = p.title.toLowerCase();
            if (t.includes("mrs") || t.includes("nyonya")) backendTitle = "nyonya";
            else if (t.includes("ms") || t.includes("nona")) backendTitle = "nona";
            
            // Concatenate Name
            const fullName = p.lastName ? `${p.firstName} ${p.lastName}` : p.firstName;

            const payload: PassengerPayload = {
                title: backendTitle,
                full_name: fullName,
                dob: p.dob,
                nationality: p.nationality
            };

            // Tambah Data Paspor (Jika ada)
            if (p.passportNumber) {
                payload.passport_number = p.passportNumber;
                payload.issuing_country = p.issuingCountry;
                payload.valid_until = p.expiryDate;
            }

            return payload;
        });

        // 2. Build Items Array
        const items: BookingItemPayload[] = [];

        // Item 1: Outbound
        if (outboundFlight) {
            items.push({
                flight_id: outboundFlight.id,
                seat_class: seatClass,
                passengers: backendPassengers
            });
        }

        // Item 2: Inbound (Jika Round Trip)
        if (inboundFlight) {
            items.push({
                flight_id: inboundFlight.id,
                seat_class: seatClass,
                passengers: backendPassengers // Penumpang sama, dicopy ke item kedua
            });
        }

        return { items };
    };


    // --- 5. HANDLERS ---

    const handlePassengerUpdate = (index: number, data: PassengerData, isValid: boolean) => {
        setPassengersData(prev => {
            const newData = [...prev];
            newData[index] = data;
            return newData;
        });
        setPassengersValidity(prev => {
            const newValidity = [...prev];
            newValidity[index] = isValid;
            return newValidity;
        });
    };

    const handleCreateBooking = async () => {
        if (!isFormValid) return;
        setIsProcessing(true);

        try {
            // 1. Transform Data
            const payload = transformToPayload();
            
            // 2. Call API
            const response = await bookingService.createBooking(payload);
            
            // 3. Success Handling
            console.log("Booking Success:", response);
            
            // Redirect ke halaman Payment (menggunakan URL dari backend)
            // Atau redirect ke halaman "Waiting for Payment" internal
            if (response.payment_url) {
                window.location.href = response.payment_url; 
            } else {
                alert(`Booking Berhasil! Order ID: ${response.order_id}`);
                navigate("/"); // Fallback ke home
            }

        } catch (error: any) {
            console.error("Booking Error:", error);
            const errMsg = error.response?.data?.message || "Gagal memproses booking. Silakan coba lagi.";
            alert(`Error: ${errMsg}`);
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 bg-red-200 rounded-full"></div>
                    <p className="text-gray-400 font-medium">Menyiapkan data penerbangan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-32">
            <SimpleNavbar />

            <div className="pt-24 max-w-6xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                    
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-6">
                        <BookerInfoCard user={user} />

                        <div className="space-y-4">
                            {passengersData.map((_, idx) => (
                                <PassengerForm 
                                    key={idx}
                                    index={idx}
                                    isInternational={isInternational}
                                    onChange={(data, isValid) => handlePassengerUpdate(idx, data, isValid)}
                                />
                            ))}
                        </div>

                        {/* Tombol Aksi di sini (Static Footer) */}
                        <BookingActionFooter 
                            grandTotal={grandTotal}
                            isValid={isFormValid}
                            isProcessing={isProcessing} // Connected to state
                            onBook={handleCreateBooking}
                        />
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4">
                        <BookingSidebar 
                            outboundFlight={outboundFlight}
                            inboundFlight={inboundFlight}
                            passengerCount={passengersData.length}
                            seatClass={searchParams.get("seat_class") || "economy"}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BookingPage;