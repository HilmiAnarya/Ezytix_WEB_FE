/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PAYMENT_GROUPS, PaymentGroup } from "../../../data/paymentStaticData";

interface Props {
    selectedMethod: string | null;
    onSelectMethod: (code: string) => void;
}

export const PaymentMethodList: React.FC<Props> = ({ selectedMethod, onSelectMethod }) => {
    const [expandedId, setExpandedId] = useState<string | null>("bank_transfer"); // Default open bank

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
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => toggleExpand(group.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium text-gray-900">{group.name}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Badges Kecil */}
                                    <div className="hidden sm:flex items-center gap-1">
                                        {group.methods.slice(0, 4).map((method, idx) => (
                                            <div
                                                key={idx}
                                                className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-500"
                                            >
                                                {method}
                                            </div>
                                        ))}
                                        {group.extra && (
                                            <span className="text-xs text-gray-400 ml-1">{group.extra}</span>
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
                                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {group.channels.map((channel) => (
                                            <button
                                                key={channel.code}
                                                onClick={() => onSelectMethod(channel.code)}
                                                className={`
                            px-4 py-3 border rounded-lg text-sm font-medium transition-all flex flex-col items-center justify-center gap-2 h-20
                            ${selectedMethod === channel.code
                                                        ? "bg-red-50 border-red-500 text-red-700 shadow-sm ring-1 ring-red-200"
                                                        : "bg-white border-gray-200 text-gray-700 hover:border-red-300 hover:bg-white hover:shadow-sm"
                                                    }
                        `}
                                            >
                                                {/* Logo Placeholder (Nanti diganti Image) */}
                                                {/* <div className="w-8 h-8 bg-gray-200 rounded-full mb-1"></div> */}
                                                <span>{channel.name}</span>
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