import React, { useState, useEffect } from "react";
import { FiUser, FiCalendar, FiFlag, FiGlobe } from "react-icons/fi";

export interface PassengerData {
  title: string;
  firstName: string;
  lastName: string;
  nationality: string;
  dob: string;
  passportNumber?: string;
  issuingCountry?: string;
  expiryDate?: string;
}

interface Props {
  index: number;
  passengerType: "adult" | "child" | "infant";
  isInternational: boolean;
  onChange: (data: PassengerData, isValid: boolean) => void;
}

export const PassengerForm: React.FC<Props> = ({ 
  index, 
  passengerType, 
  isInternational, 
  onChange 
}) => {

  // --- HELPER: Label berdasarkan Tipe ---
  const getTypeLabel = () => {
    switch (passengerType) {
      case "child": return "Anak";
      case "infant": return "Bayi";
      default: return "Dewasa";
    }
  };
  const label = getTypeLabel();

  // --- LOCAL STATE ---
  const [hasSingleName, setHasSingleName] = useState(false);
  const [formData, setFormData] = useState<PassengerData>({
    title: passengerType === "infant" || passengerType === "child" ? "Mstr" : "Mr",
    firstName: "",
    lastName: "",
    nationality: "Indonesia",
    dob: "",
    passportNumber: "",
    issuingCountry: "",
    expiryDate: ""
  });

  // --- VALIDATION EFFECT ---
  useEffect(() => {
    let isValid =
      formData.firstName.length > 0 &&
      formData.dob.length > 0 &&
      formData.nationality.length > 0;

    if (!hasSingleName && formData.lastName.length === 0) {
      isValid = false;
    }

    if (isInternational) {
      const passportOk =
        (formData.passportNumber?.length || 0) > 0 &&
        (formData.issuingCountry?.length || 0) > 0 &&
        (formData.expiryDate?.length || 0) > 0;

      if (!passportOk) isValid = false;
    }

    const cleanData = { ...formData };
    if (hasSingleName) cleanData.lastName = "";

    onChange(cleanData, isValid);
  }, [formData, hasSingleName, isInternational]);

  const handleChange = (field: keyof PassengerData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-4">
      
      {/* === MAIN HEADER (Solid Red matching Figma) === */}
      <div className="bg-red-600 px-4 py-3 border-b border-red-700">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          Penumpang {index + 1} 
          <span className="bg-red-700 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
            {label}
          </span>
        </h3>
      </div>

      <div className="p-6 space-y-6">
        
        {/* --- Title Field --- */}
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-2">Titel</label>
          <div className="relative">
            <select
              className="w-full max-w-[160px] h-11 px-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-medium text-gray-700 cursor-pointer hover:border-red-300 transition"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            >
              <option value="Mr">Tuan (Mr)</option>
              <option value="Mrs">Nyonya (Mrs)</option>
              <option value="Ms">Nona (Ms)</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 max-w-[120px]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* --- Name Fields --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 font-medium mb-2">
              Nama Depan / Tengah (sesuai KTP/Paspor)
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full h-11 px-3 pl-10 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-medium placeholder-gray-400 transition"
                placeholder="Contoh: Budi"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-2 ${hasSingleName ? "text-gray-300" : "text-gray-500"}`}>
              Nama Belakang / Keluarga
            </label>
            <div className="relative">
              <input
                type="text"
                disabled={hasSingleName}
                className={`w-full h-11 px-3 pl-10 border rounded-md focus:ring-2 focus:ring-red-500 outline-none font-medium transition-all
                  ${hasSingleName
                    ? "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed"
                    : "bg-white border-gray-300 placeholder-gray-400 hover:border-red-300"
                  }`}
                placeholder={hasSingleName ? "" : "Contoh: Santoso"}
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
              <FiUser className={`absolute left-3 top-1/2 -translate-y-1/2 ${hasSingleName ? "text-gray-300" : "text-gray-400"}`} />
            </div>
          </div>
        </div>

        {/* --- Single Name Toggle --- */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasSingleName}
            onChange={() => setHasSingleName(!hasSingleName)}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 accent-red-600"
          />
          <span className="text-sm text-gray-700 font-medium">
            Nama Penumpang ini hanya memiliki 1 kata
          </span>
        </label>

        {/* --- DOB & Nationality --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 font-medium mb-2">Tanggal Lahir</label>
            <div className="relative">
              {/* Note: Tetap menggunakan input type="date" untuk menjaga logika state 'dob' string */}
              <input
                type="date"
                className="w-full h-11 px-3 pl-10 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none text-gray-700 font-medium cursor-pointer"
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
              />
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 font-medium mb-2">Kewarganegaraan</label>
            <div className="relative">
              <select
                className="w-full h-11 px-3 pl-10 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none font-medium text-gray-700 cursor-pointer appearance-none"
                value={formData.nationality}
                onChange={(e) => handleChange("nationality", e.target.value)}
              >
                <option value="Indonesia">Indonesia</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Singapore">Singapore</option>
                <option value="Japan">Japan</option>
                <option value="Other">Lainnya</option>
              </select>
              <FiFlag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* --- PASSPORT SECTION (International Only) --- */}
        {isInternational && (
          <div className="mt-2">
            {/* Passport Header - Red */}
            <div className="bg-red-600 px-4 py-3 -mx-6 mb-6 flex items-center gap-2">
               <FiGlobe className="text-white" />
               <h4 className="text-white font-semibold text-sm">
                 Informasi Paspor
               </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Passport Number */}
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-2">Nomor Paspor</label>
                <input
                  type="text"
                  className="w-full h-11 px-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none font-medium placeholder-gray-400"
                  placeholder="X1234567"
                  value={formData.passportNumber}
                  onChange={(e) => handleChange("passportNumber", e.target.value)}
                />
              </div>

              {/* Issuing Country */}
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-2">Negara Penerbit</label>
                <div className="relative">
                  <select
                    className="w-full h-11 px-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none font-medium text-gray-700 cursor-pointer appearance-none"
                    value={formData.issuingCountry}
                    onChange={(e) => handleChange("issuingCountry", e.target.value)}
                  >
                    <option value="">Pilih Negara</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-2">Berlaku Hingga</label>
                <input
                  type="date"
                  className="w-full h-11 px-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none font-medium text-gray-700 cursor-pointer"
                  value={formData.expiryDate}
                  onChange={(e) => handleChange("expiryDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};