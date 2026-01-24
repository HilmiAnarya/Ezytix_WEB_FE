import React from "react";
import { Flight } from "../../types/api";
import { FlightSummaryCard } from "./FlightSummaryCard";
import { BookingPriceSummary } from "./BookingPriceSummary";

interface Props {
  outboundFlight: Flight | null;
  inboundFlight: Flight | null;
  passengerCount: number;
  seatClass: string;
}

export const BookingSidebar: React.FC<Props> = ({
  outboundFlight,
  inboundFlight,
  passengerCount,
  seatClass
}) => {
  
  // --- HELPER: Ambil harga berdasarkan seatClass yang dipilih ---
  const getPrice = (flight: Flight | null) => {
    if (!flight) return 0;
    
    // Cari kelas yang cocok (case insensitive)
    const foundClass = flight.flight_classes.find(
        (fc) => fc.seat_class.toLowerCase() === seatClass.toLowerCase()
    );

    // Jika ketemu ambil harganya, jika tidak return 0
    return foundClass ? parseFloat(foundClass.price.toString()) : 0;
  };

  // Gunakan helper untuk mendapatkan harga yang akurat
  const outboundPrice = getPrice(outboundFlight);
  const inboundPrice = getPrice(inboundFlight);

  return (
    <div className="sticky top-24 space-y-6 animate-fadeIn">
        {/* 1. Info Penerbangan */}
        {outboundFlight && (
            <FlightSummaryCard 
                outboundFlight={outboundFlight}
                inboundFlight={inboundFlight}
            />
        )}

        {/* 2. Rincian Harga */}
        <BookingPriceSummary 
            passengerCount={passengerCount}
            seatClass={seatClass}
            outboundPrice={outboundPrice}
            inboundPrice={inboundPrice}
        />
    </div>
  );
};