import React from "react";
import { FiX, FiSearch, FiRefreshCw, FiMapPin } from "react-icons/fi";
import { useSearchForm, SearchFormInitialValues } from "../../../hooks/useSearchForm"; // Import Hook tadi
import { AirportCombobox } from "../../ui/AirportCombobox";
import { CalendarSelector } from "../../ui/CalendarSelector";
import { PassengerSelector } from "../../ui/PassengerSelector";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialValues?: SearchFormInitialValues;
}

const BoxLabel: React.FC<{ label: string }> = ({ label }) => (
    <div className="mb-2 w-full text-left pl-1">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            {label}
        </span>
    </div>
);

const RadioOption: React.FC<{
    label: string;
    selected: boolean;
    onChange: () => void;
}> = ({ label, selected, onChange }) => (
    <label className="flex items-center gap-3 cursor-pointer group select-none">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? "border-red-600" : "border-gray-300 group-hover:border-gray-400"}`}>
            {selected && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
        </div>
        <input type="radio" checked={selected} onChange={onChange} className="hidden" />
        <span className={`text-sm font-bold ${selected ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700"}`}>
            {label}
        </span>
    </label>
);

export const EditSearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, initialValues }) => {
    const form = useSearchForm(initialValues);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Ubah Pencarian</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900">
                        <FiX className="text-xl" />
                    </button>
                </div>
                <div className="flex gap-8 mb-6 border-b border-gray-100 pb-4">
                    <RadioOption label="Sekali Jalan" selected={!form.isRoundTrip} onChange={() => form.setIsRoundTrip(false)} />
                    <RadioOption label="Pulang Pergi" selected={form.isRoundTrip} onChange={() => form.setIsRoundTrip(true)} />
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end mb-4">
                    <div>
                        <BoxLabel label="Dari" />
                        <AirportCombobox airports={form.airports} value={form.origin} onChange={form.setOrigin} placeholder="Pilih kota" />
                    </div>
                    <button
                        onClick={form.handleSwap}
                        className="p-3 rounded-full bg-gray-50 text-gray-400 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all mb-[2px] transform hover:rotate-180 duration-300"
                    >
                        <FiRefreshCw className="text-lg" />
                    </button>
                    <div>
                        <BoxLabel label="Ke" />
                        <AirportCombobox 
                            icon={<FiMapPin className="text-blue-500 text-xl" />} 
                            airports={form.airports} 
                            value={form.destination} 
                            onChange={form.setDestination} 
                            placeholder="Pilih kota" 
                            popoverAlign="right"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <BoxLabel label="Pergi" />
                        <CalendarSelector
                            selectedDate={form.departureDate}
                            onChange={form.setDepartureDate}
                            minDate={form.today}
                        />
                    </div>

                    <div
                        onClick={() => !form.isRoundTrip && form.setIsRoundTrip(true)}
                        className={!form.isRoundTrip ? "cursor-pointer" : ""}
                    >
                        <BoxLabel label="Pulang" />
                        <CalendarSelector
                            selectedDate={form.returnDate}
                            onChange={form.setReturnDate}
                            minDate={form.addDays(form.departureDate, 1)}
                            disabled={!form.isRoundTrip}
                            placeholder={!form.isRoundTrip ? "Pulang Pergi" : "Pilih Tanggal"}
                            popoverAlign="right"
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <BoxLabel label="Penumpang & Kelas" />
                    <PassengerSelector
                        adults={form.adults}
                        children={form.children}
                        infants={form.infants}
                        seatClass={form.seatClass}
                        onUpdate={(a, c, i, s) => { form.setAdults(a); form.setChildren(c); form.setInfants(i); form.setSeatClass(s); }}
                    />
                </div>
                <button
                    onClick={() => form.handleSearch(onClose)} // Pass onClose sebagai callback
                    className="w-full h-[54px] bg-red-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-red-700 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
                >
                    <FiSearch className="text-xl" />
                    <span>Cari Tiket</span>
                </button>
            </div>
        </div>
    );
};