import React from "react";

interface Props {
    totalAmount: number;
    selectedMethod: string | null;
    onPay: () => void;
    loading?: boolean;
}

export const PaymentTotalCard: React.FC<Props> = ({ totalAmount, selectedMethod, onPay, loading }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "decimal",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky bottom-0 md:relative z-10">
            <div className="flex items-center justify-between mb-4">
                <span className="text-base font-medium text-gray-700">Total Pembayaran</span>
                <span className="text-xl font-bold text-red-600">
                    IDR {formatCurrency(totalAmount)}
                </span>
            </div>
            <button
                onClick={onPay}
                disabled={!selectedMethod || loading}
                className={`w-full py-3 rounded-xl font-bold text-white transition-all transform active:scale-[0.98]
            ${!selectedMethod || loading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-red-200"
                    }
        `}
            >
                {loading ? "Memproses..." : selectedMethod ? `Bayar dengan ${selectedMethod}` : "Pilih Metode Pembayaran"}
            </button>
        </div>
    );
};