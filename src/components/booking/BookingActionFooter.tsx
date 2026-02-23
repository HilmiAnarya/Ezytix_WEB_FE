import React from "react";

interface Props {
  grandTotal: number;
  isValid: boolean;     
  isProcessing: boolean; 
  onBook: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const BookingActionFooter: React.FC<Props> = ({ 
    grandTotal, 
    isValid, 
    isProcessing,
    onBook 
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
        <div className="flex flex-col gap-5">
            <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                <div className="flex flex-col">
                    <span className="text-gray-500 text-sm font-medium">Total Pembayaran</span>
                    <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Termasuk Pajak
                    </span>
                </div>
                <div className="text-right">
                    <span className="block text-3xl font-black text-gray-900 tracking-tight">
                        {formatCurrency(grandTotal)}
                    </span>
                </div>
            </div>
            <button
                onClick={onBook}
                disabled={!isValid || isProcessing}
                className={`
                    w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform active:scale-[0.99] flex justify-center items-center gap-2
                    ${!isValid 
                        ? "bg-gray-300 cursor-not-allowed shadow-none" 
                        : isProcessing 
                            ? "bg-red-400 cursor-wait"
                            : "bg-red-600 hover:bg-red-700 hover:shadow-red-200 hover:-translate-y-0.5"
                    }
                `}
            >
                {isProcessing ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memproses...
                    </>
                ) : (
                    "Lanjut ke Pembayaran"
                )}
            </button>
            {!isValid && (
                <p className="text-xs text-red-500 text-center font-medium animate-pulse bg-red-50 py-2 rounded-lg border border-red-100">
                    ⚠️ Mohon lengkapi semua data penumpang di atas untuk melanjutkan
                </p>
            )}
        </div>
    </div>
  );
};