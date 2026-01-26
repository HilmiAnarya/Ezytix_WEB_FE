import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
// Pastikan path import ini sesuai dengan struktur folder kamu
import { PAYMENT_GROUPS} from "../../../data/paymentStaticData";
import { PaymentType } from "../../../types/payment";

// [UPDATED] Interface Props
// Kita ubah 'selectedMethod' -> 'selectedMethodCode' agar konsisten dengan Parent Page
interface Props {
    selectedMethodCode: string | null;
    onSelectMethod: (code: string, type: PaymentType) => void;
}

export const PaymentMethodList: React.FC<Props> = ({ selectedMethodCode, onSelectMethod }) => {
    // Default expand group pertama (Bank Transfer) agar user langsung lihat opsi
    const [expandedId, setExpandedId] = useState<string | null>("bank_transfer");

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 pb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Metode Pembayaran</h2>
                <p className="text-sm text-gray-500">
                    Silakan pilih metode pembayaran yang tersedia untuk menyelesaikan transaksi pemesanan anda.
                </p>
            </div>

            <div className="border-t border-gray-100">
                {PAYMENT_GROUPS.map((group) => {
                    const Icon = group.icon;
                    return (
                        <div key={group.id}>
                            {/* Header Accordion */}
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50"
                                onClick={() => toggleExpand(group.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${expandedId === group.id ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-gray-900">{group.name}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Badges Kecil (List Bank) */}
                                    <div className="hidden sm:flex items-center gap-1">
                                        {group.methods.slice(0, 4).map((method, idx) => (
                                            <div
                                                key={idx}
                                                className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase"
                                            >
                                                {method}
                                            </div>
                                        ))}
                                        {group.extra && (
                                            <span className="text-xs text-gray-400 ml-1 bg-gray-50 px-2 py-1 rounded">
                                                {group.extra}
                                            </span>
                                        )}
                                    </div>
                                    {expandedId === group.id ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {/* Expanded Content (Grid Tombol Bank) */}
                            {expandedId === group.id && (
                                <div className="px-6 py-4 bg-gray-50/30 animate-in slide-in-from-top-2 duration-200">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {group.channels.map((channel) => (
                                            <button
                                                key={channel.code}
                                                // [CRITICAL] Kirim Code DAN Type ke Parent
                                                onClick={() => onSelectMethod(channel.code, channel.type)}
                                                className={`
                                                    relative px-3 py-3 border rounded-xl text-sm font-medium transition-all duration-200 
                                                    flex flex-col items-center justify-center gap-2 h-24
                                                    ${selectedMethodCode === channel.code
                                                        ? "bg-red-50 border-red-500 text-red-700 shadow-md ring-1 ring-red-200 transform scale-[1.02]"
                                                        : "bg-white border-gray-200 text-gray-600 hover:border-red-200 hover:bg-white hover:shadow-sm hover:-translate-y-0.5"
                                                    }
                                                `}
                                            >
                                                {/* Logo Rendering */}
                                                {channel.logo ? (
                                                    <img 
                                                        src={channel.logo} 
                                                        alt={channel.name} 
                                                        className="h-8 w-auto object-contain mb-1"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none'; 
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400 mb-1">
                                                        Logo
                                                    </div>
                                                )}
                                                
                                                <span className="text-center text-xs leading-tight font-semibold">
                                                    {channel.name}
                                                </span>

                                                {/* Checkmark Icon jika selected */}
                                                {selectedMethodCode === channel.code && (
                                                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};