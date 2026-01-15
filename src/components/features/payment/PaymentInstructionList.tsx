import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Tipe data instruksi (Nanti pindah ke types)
interface InstructionStep {
    title: string;
    steps: string[];
}

interface Props {
    instructions: InstructionStep[];
}

export const PaymentInstructionList: React.FC<Props> = ({ instructions }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0); // Default buka yg pertama

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h3 className="text-base font-bold text-gray-900">Cara Pembayaran</h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {instructions.map((item, idx) => (
            <div key={idx}>
                <button 
                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                    <span className="text-sm font-semibold text-gray-700">{item.title}</span>
                    {openIdx === idx ? <ChevronUp className="w-4 h-4 text-gray-400"/> : <ChevronDown className="w-4 h-4 text-gray-400"/>}
                </button>
                
                {openIdx === idx && (
                    <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-1">
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 ml-1">
                            {item.steps.map((step, sIdx) => (
                                <li key={sIdx} className="leading-relaxed pl-2 -indent-2">
                                    {step}
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};