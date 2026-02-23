/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Info, Smartphone, Monitor, CreditCard, Store } from "lucide-react";
import { PaymentInstructions, InstructionGroup } from "../../../types/payment";

interface Props {
  instructions?: PaymentInstructions;
  paymentCode?: string;
  billerCode?: string;
}

export const PaymentInstructionList: React.FC<Props> = ({ 
  instructions, 
  paymentCode,
  billerCode 
}) => {
  const [userSelectedTab, setUserSelectedTab] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isArray = Array.isArray(instructions);
  const categories = useMemo(() => {
    return !isArray && instructions 
      ? Object.keys(instructions).filter(k => (instructions as any)[k] && (instructions as any)[k].length > 0)
      : [];
  }, [instructions, isArray]);
  const activeTab = (userSelectedTab && categories.includes(userSelectedTab)) 
      ? userSelectedTab 
      : (categories.length > 0 ? categories[0] : "");
  if (!instructions || (isArray && (instructions as any[]).length === 0) || (!isArray && categories.length === 0)) {
    return null;
  }

  const activeInstructions: InstructionGroup[] = isArray 
    ? (instructions as InstructionGroup[])
    : (instructions as any)[activeTab] || [];
  const getTabLabel = (key: string) => {
    const map: Record<string, string> = {
      "atm": "ATM",
      "mbanking": "Mobile Banking",
      "ibanking": "Internet Banking",
      "livin by mandiri": "Livin' by Mandiri"
    };
    return map[key.toLowerCase()] || key.replace(/_/g, " ").toUpperCase();
  };

  const getTabIcon = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes("atm")) return <CreditCard className="w-4 h-4" />;
    if (k.includes("mbanking") || k.includes("livin")) return <Smartphone className="w-4 h-4" />;
    if (k.includes("ibanking")) return <Monitor className="w-4 h-4" />;
    return <Info className="w-4 h-4" />;
  };

  const parseInstructionText = (text: string) => {
    let cleanText = text;
    if (paymentCode) cleanText = cleanText.replace(/{{fullPaymentCode}}/g, paymentCode);
    const companyCode = billerCode || "70012"; 
    cleanText = cleanText.replace(/{{companyCode}}/g, companyCode);
    cleanText = cleanText.replace(/{{merchantName}}/g, "Ezytix");
    cleanText = cleanText.replace(/Xendit/g, "Midtrans");
    cleanText = cleanText
      .replace(/<bold>/g, "<strong class='font-semibold text-gray-900'>")
      .replace(/<\/bold>/g, "</strong>")
      .replace(/<anchor>/g, "<span class='text-blue-600 underline cursor-pointer'>")
      .replace(/<\/anchor>/g, "</span>");

    return { __html: cleanText };
  };
  const handleTabClick = (cat: string) => {
    setUserSelectedTab(cat);
    setOpenIndex(0); 
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mt-6">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        {isArray ? <Store className="w-4 h-4 text-gray-500" /> : <Info className="w-4 h-4 text-gray-500" />}
        <h3 className="font-bold text-gray-800 text-sm">Cara Pembayaran</h3>
      </div>
      {!isArray && (
        <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide bg-white">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleTabClick(cat)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 
                ${activeTab === cat 
                  ? "border-red-600 text-red-600 bg-red-50/30" 
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
            >
              {getTabIcon(cat)}
              {getTabLabel(cat)}
            </button>
          ))}
        </div>
      )}
      <div className="divide-y divide-gray-100">
        {activeInstructions.map((group, idx) => (
          <div key={idx} className="transition-colors hover:bg-gray-50 group">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className={`font-medium text-sm transition-colors ${openIndex === idx ? 'text-red-700' : 'text-gray-700'}`}>
                {group.title}
              </span>
              {openIndex === idx ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              )}
            </button>

            {openIndex === idx && (
              <div className="px-4 pb-4 animate-in slide-in-from-top-1">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {group.is_unordered ? (
                     <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-gray-600">
                        {Object.values(group.steps).map((stepText, sIdx) => (
                          <li key={sIdx} className="leading-relaxed pl-1">
                            <span dangerouslySetInnerHTML={parseInstructionText(stepText)} />
                          </li>
                        ))}
                     </ul>
                  ) : (
                    <ol className="list-decimal list-outside ml-4 space-y-2 text-sm text-gray-600">
                      {Object.values(group.steps).map((stepText, sIdx) => (
                        <li key={sIdx} className="leading-relaxed pl-1">
                          <span dangerouslySetInnerHTML={parseInstructionText(stepText)} />
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};