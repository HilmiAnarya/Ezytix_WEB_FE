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
import { bookingService } from "../services/bookingService";
import { Flight } from "../types/api";
import { CreateBookingRequest, BookingItemPayload, PassengerPayload } from "../types/booking";

// --- HELPER: Generator Tipe Penumpang ---
// Mengubah jumlah (2 Dewasa, 1 Anak) menjadi array ["adult", "adult", "child"]
const generatePassengerList = (
  adults: number, 
  children: number, 
  infants: number
): ("adult" | "child" | "infant")[] => {
  const list: ("adult" | "child" | "infant")[] = [];
  for (let i = 0; i < adults; i++) list.push("adult");
  for (let i = 0; i < children; i++) list.push("child");
  for (let i = 0; i < infants; i++) list.push("infant");
  return list;
};

const BookingPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // --- 1. STATE MANAGEMENT ---
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [outboundFlight, setOutboundFlight] = useState<Flight | null>(null);
    const [inboundFlight, setInboundFlight] = useState<Flight | null>(null);

    // Ambil parameter jumlah penumpang
    const adultsCount = Number(searchParams.get("adults")) || 1;
    const childrenCount = Number(searchParams.get("children")) || 0;
    const infantsCount = Number(searchParams.get("infants")) || 0;
    const totalPassengers = adultsCount + childrenCount + infantsCount;

    // Generate List Tipe Penumpang (untuk Header Dinamis)
    const passengerTypes = useMemo(() => 
        generatePassengerList(adultsCount, childrenCount, infantsCount), 
    [adultsCount, childrenCount, infantsCount]);

    // State Data Form Penumpang
    const [passengersData, setPassengersData] = useState<PassengerData[]>([]);
    const [passengersValidity, setPassengersValidity] = useState<boolean[]>([]);

    // --- 2. INITIAL FETCHING ---
    useEffect(() => {
        const fetchBookingContext = async () => {
            setLoading(true);
            try {
                const outboundId = searchParams.get("outbound_id");
                const inboundId = searchParams.get("inbound_id");

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

                // Init State Array kosong sesuai jumlah penumpang
                setPassengersData(new Array(totalPassengers).fill(null));
                setPassengersValidity(new Array(totalPassengers).fill(false));

            } catch (error) {
                console.error("Error loading booking data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingContext();
    }, [searchParams, navigate, totalPassengers]);


    // --- 3. LOGIC & CALCULATIONS ---

    // A. Deteksi Internasional
    const isInternational = useMemo(() => {
        if (!outboundFlight) return false;
        
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
        const count = passengersData.length; // atau totalPassengers
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


    // --- 4. DATA TRANSFORMATION ---
    const transformToPayload = (): CreateBookingRequest => {
        const seatClass = searchParams.get("seat_class") || "economy";

        // Mapping Penumpang
        const backendPassengers: PassengerPayload[] = passengersData.map((p) => {
            // Mapping Title
            let backendTitle = "tuan"; 
            const t = p.title.toLowerCase();
            if (t.includes("mrs") || t.includes("nyonya")) backendTitle = "nyonya";
            else if (t.includes("ms") || t.includes("nona")) backendTitle = "nona";
            else if (t.includes("mstr")) backendTitle = "tuan"; // Anak laki-laki
            else if (t.includes("miss")) backendTitle = "nona"; // Anak perempuan
            
            const fullName = p.lastName ? `${p.firstName} ${p.lastName}` : p.firstName;

            // Tentukan Type Penumpang untuk Backend (jika diperlukan logic khusus)
            // Di sini kita pakai title & dob standard
            
            const payload: PassengerPayload = {
                title: backendTitle,
                full_name: fullName,
                dob: p.dob,
                nationality: p.nationality
            };

            if (p.passportNumber) {
                payload.passport_number = p.passportNumber;
                payload.issuing_country = p.issuingCountry;
                payload.valid_until = p.expiryDate;
            }

            return payload;
        });

        const items: BookingItemPayload[] = [];

        if (outboundFlight) {
            items.push({
                flight_id: outboundFlight.id,
                seat_class: seatClass,
                passengers: backendPassengers
            });
        }

        if (inboundFlight) {
            items.push({
                flight_id: inboundFlight.id,
                seat_class: seatClass,
                passengers: backendPassengers
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
            const payload = transformToPayload();
            const response = await bookingService.createBooking(payload);
            
            console.log("Booking Success:", response);
            
            if (response.payment_url) {
                window.location.href = response.payment_url; 
            } else {
                alert(`Booking Berhasil! Order ID: ${response.order_id}`);
                navigate("/");
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
                        
                        {/* 1. Detail Pemesan (Auto-filled) */}
                        <BookerInfoCard />

                        {/* 2. Form Penumpang (Dynamic Rendering) */}
                        <div className="space-y-4">
                            {passengerTypes.map((type, idx) => (
                                <PassengerForm 
                                    key={`pax-${idx}`}
                                    index={idx}
                                    passengerType={type} // <-- Ini kunci header dinamis (Dewasa/Anak)
                                    isInternational={isInternational} // Force true di dalam component jika mau debug
                                    onChange={(data, isValid) => handlePassengerUpdate(idx, data, isValid)}
                                />
                            ))}
                        </div>

                        {/* 3. Action Footer (Desktop/Mobile) */}
                        <BookingActionFooter 
                            grandTotal={grandTotal}
                            isValid={isFormValid}
                            isProcessing={isProcessing}
                            onBook={handleCreateBooking}
                        />
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4">
                        <BookingSidebar 
                            outboundFlight={outboundFlight}
                            inboundFlight={inboundFlight}
                            passengerCount={totalPassengers}
                            seatClass={searchParams.get("seat_class") || "economy"}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BookingPage;