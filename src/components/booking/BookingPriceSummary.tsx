import React from "react";

interface Props {
  passengerCount: number;
  seatClass: string;
  outboundPrice: number;
  inboundPrice?: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const BookingPriceSummary: React.FC<Props> = ({ 
  passengerCount, 
  seatClass, 
  outboundPrice, 
  inboundPrice = 0 
}) => {
  
  const totalOutbound = outboundPrice * passengerCount;
  const totalInbound = inboundPrice * passengerCount;
  const grandTotal = totalOutbound + totalInbound;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* === HEADER MERAH (Sama dengan Flight Summary) === */}
        <div className="bg-red-600 px-5 py-3 border-b border-red-700">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                Rincian Harga
            </h3>
        </div>
        
        {/* === BODY === */}
        <div className="p-5 space-y-3">
            
            {/* Outbound */}
            <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">
                    Tiket Pergi (x{passengerCount}) 
                    <span className="block text-[10px] text-gray-400 capitalize font-normal mt-0.5">
                        {seatClass.replace('_', ' ')}
                    </span>
                </span>
                <span className="font-bold text-gray-900">{formatCurrency(totalOutbound)}</span>
            </div>

            {/* Inbound */}
            {inboundPrice > 0 && (
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">
                        Tiket Pulang (x{passengerCount})
                        <span className="block text-[10px] text-gray-400 capitalize font-normal mt-0.5">
                            {seatClass.replace('_', ' ')}
                        </span>
                    </span>
                    <span className="font-bold text-gray-900">{formatCurrency(totalInbound)}</span>
                </div>
            )}

            {/* Tax */}
            <div className="flex justify-between text-sm items-center">
                <span className="text-gray-600">Pajak & Biaya</span>
                <span className="font-bold text-xs text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                    Termasuk
                </span>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-gray-200 my-4"></div>

            {/* Total */}
            <div className="flex justify-between items-end">
                <span className="font-bold text-gray-500 text-sm mb-1">Total Estimasi</span>
                <span className="font-black text-xl text-red-600 tracking-tight">
                    {formatCurrency(grandTotal)}
                </span>
            </div>
            
        </div>
    </div>
  );
};