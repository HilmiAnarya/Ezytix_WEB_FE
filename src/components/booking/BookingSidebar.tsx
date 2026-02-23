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
  const getPrice = (flight: Flight | null) => {
    if (!flight) return 0;
    const foundClass = flight.flight_classes.find(
        (fc) => fc.seat_class.toLowerCase() === seatClass.toLowerCase()
    );
    return foundClass ? parseFloat(foundClass.price.toString()) : 0;
  };
  const outboundPrice = getPrice(outboundFlight);
  const inboundPrice = getPrice(inboundFlight);

  return (
    <div className="sticky top-24 space-y-6 animate-fadeIn">
        {outboundFlight && (
            <FlightSummaryCard 
                outboundFlight={outboundFlight}
                inboundFlight={inboundFlight}
            />
        )}
        <BookingPriceSummary 
            passengerCount={passengerCount}
            seatClass={seatClass}
            outboundPrice={outboundPrice}
            inboundPrice={inboundPrice}
        />
    </div>
  );
};