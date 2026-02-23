/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Flight } from "../../types/api";

interface Props {
  outboundFlight: Flight | null;
  inboundFlight: Flight | null;
}

const formatDate = (isoStr: string) => {
  if (!isoStr) return "-";
  return new Date(isoStr).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
};

const formatTime = (isoStr: string) => {
  if (!isoStr) return "--:--";
  return new Date(isoStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const getDurationString = (flight: Flight) => {
  if ((flight as any).duration_formatted) return (flight as any).duration_formatted;
  if ((flight as any).total_duration_minutes) {
    const mins = (flight as any).total_duration_minutes;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}j ${m}m`;
  }
  const start = new Date(flight.departure_time).getTime();
  const end = new Date(flight.arrival_time).getTime();
  const diffMins = Math.floor((end - start) / 60000);
  const h = Math.floor(diffMins / 60);
  const m = diffMins % 60;
  return `${h}j ${m}m`;
};

const getTransitInfo = (flight: Flight) => {
  return (flight as any).transit_info || "Direct";
};

export const FlightSummaryCard: React.FC<Props> = ({ outboundFlight, inboundFlight }) => {

  const renderFlightSection = (flight: Flight, type: "outbound" | "inbound") => {
    const isOutbound = type === "outbound";
    const badgeLabel = isOutbound ? "Pergi" : "Pulang";
    const badgeClass = isOutbound
      ? "bg-red-50 text-red-600"
      : "bg-red-50 text-red-600";
    const dotColor = isOutbound ? "bg-red-600" : "bg-red-600";
    const containerClass = isOutbound && inboundFlight
      ? "border-b border-gray-100 pb-4 mb-4"
      : "";

    return (
      <div className={containerClass}>
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
            {badgeLabel}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {formatDate(flight.departure_time)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center bg-white p-1 shadow-sm">
            {flight.airline?.logo_url ? (
              <img src={flight.airline.logo_url} alt={flight.airline.name} className="w-5 h-5 object-contain" />
            ) : (
              <span className="text-[10px] font-bold text-red-600">{flight.airline?.iata || "FL"}</span>
            )}
          </div>
          <div className="flex-1 flex items-center justify-between gap-2">
            <div className="text-center min-w-[40px]">
              <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                {formatTime(flight.departure_time)}
              </p>
              <p className="text-[10px] text-gray-500 font-medium">
                {flight.origin?.code}
              </p>
            </div>
            <div className="flex-1 flex flex-col items-center px-2">
              <span className="text-[10px] text-gray-400 mb-1 font-medium">
                {getDurationString(flight)}
              </span>
              <div className="w-full h-px bg-gray-200 relative">
                <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${dotColor}`} />
              </div>
              <span className="text-[10px] text-gray-400 mt-1 font-medium">
                {getTransitInfo(flight)}
              </span>
            </div>
            <div className="text-center min-w-[40px]">
              <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                {formatTime(flight.arrival_time)}
              </p>
              <p className="text-[10px] text-gray-500 font-medium">
                {flight.destination?.code}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!outboundFlight && !inboundFlight) {
    return null;
  }

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="bg-red-600 px-5 py-3 border-b border-red-700">
        <h3 className="text-white font-bold text-sm uppercase tracking-wider">
          Flight Summary
        </h3>
      </div>
      <div className="p-5">
        {outboundFlight && renderFlightSection(outboundFlight, "outbound")}
        {inboundFlight && renderFlightSection(inboundFlight, "inbound")}
      </div>
    </div>
  );
};