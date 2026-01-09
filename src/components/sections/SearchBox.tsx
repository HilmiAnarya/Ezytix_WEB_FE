/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { FiSearch, FiRefreshCw, FiMapPin } from "react-icons/fi";
import { useNavigate, createSearchParams } from "react-router-dom";
import { airportService } from "../../services/airportService";
import { Airport } from "../../types/api";
import { AirportCombobox } from "../ui/AirportCombobox";
import { PassengerSelector } from "../ui/PassengerSelector";
import { CalendarSelector } from "../ui/CalendarSelector";

// --- 1. DEFINISI PROPS BARU ---
export interface SearchBoxProps {
    initialValues?: {
        origin?: Airport;
        destination?: Airport;
        departureDate?: string;
        returnDate?: string;
        adults?: number;
        children?: number;
        infants?: number;
        seatClass?: string;
    };
    isCompact?: boolean;       // Mode tampilan (False = Landing Page, True = Modal)
    onSearchSubmit?: () => void; // Callback setelah search (misal: tutup modal)
}

// --- 2. LABEL BOX COMPONENT ---
const BoxLabel: React.FC<{ label: string }> = ({ label }) => (
    <div className="mb-2 w-full text-left pl-1">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            {label}
        </span>
    </div>
);

// --- 3. KOMPONEN UTAMA ---
export const SearchBox: React.FC<SearchBoxProps> = ({ 
    initialValues, 
    isCompact = false, // Default FALSE agar Landing Page tidak berubah
    onSearchSubmit 
}) => {
    const navigate = useNavigate();
    
    // STATE DATA
    const [airports, setAirports] = useState<Airport[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    
    // FORM STATE (Inisialisasi dengan initialValues jika ada)
    const [isRoundTrip, setIsRoundTrip] = useState(!!initialValues?.returnDate);
    const [origin, setOrigin] = useState<Airport | null>(initialValues?.origin || null);
    const [destination, setDestination] = useState<Airport | null>(initialValues?.destination || null);
    
    const today = new Date().toISOString().split('T')[0];
    const [departureDate, setDepartureDate] = useState<string>(initialValues?.departureDate || today);
    const [returnDate, setReturnDate] = useState<string>(initialValues?.returnDate || ""); 

    const [adults, setAdults] = useState(initialValues?.adults || 1);
    const [children, setChildren] = useState(initialValues?.children || 0);
    const [infants, setInfants] = useState(initialValues?.infants || 0);
    const [seatClass, setSeatClass] = useState(initialValues?.seatClass || "economy");

    // FETCH DATA
    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const data = await airportService.getAirports();
                setAirports(data);
                
                // LOGIC DEFAULT (Hanya jalan jika TIDAK ada initialValues)
                // Agar data dari Modal tidak tertimpa default CGK/DPS
                if (data.length > 0 && !initialValues) {
                    const defaultOrigin = data.find(a => a.code === 'CGK') || data[0];
                    setOrigin(defaultOrigin);
                    const defaultDest = data.find(a => a.code === 'DPS') || data.find(a => a.id !== defaultOrigin.id);
                    if (defaultDest) setDestination(defaultDest);
                }
            } catch (error) {
                console.error("Gagal load bandara", error);
            } finally {
                setLoadingData(false);
            }
        };
        fetchAirports();
    }, [initialValues]); // Tambahkan initialValues ke dependency (aman karena object prop jarang berubah ref kecuali parent re-render)

    // DATE LOGIC
    const addDays = (dateStr: string, days: number) => {
        const result = new Date(dateStr);
        result.setDate(result.getDate() + days);
        return result.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (isRoundTrip) {
            if (!returnDate || returnDate <= departureDate) {
                setReturnDate(addDays(departureDate, 1));
            }
        } else {
            setReturnDate("");
        }
    }, [isRoundTrip, departureDate]);

    // HANDLERS
    const handleSwap = () => {
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
    };

    const handleSearch = () => {
        if (!origin || !destination) return alert("Pilih bandara asal & tujuan");
        if (origin.id === destination.id) return alert("Bandara tidak boleh sama");
        if (isRoundTrip && !returnDate) return alert("Pilih tanggal pulang");

        const searchParams: any = {
            origin: origin.id.toString(),
            destination: destination.id.toString(),
            departure_date: departureDate,
            adults: adults.toString(),
            children: children.toString(),
            infants: infants.toString(),
            seat_class: seatClass,
        };

        if (isRoundTrip && returnDate) {
            searchParams.return_date = returnDate;
        }

        // 1. Navigasi
        navigate({
            pathname: "/search",
            search: createSearchParams(searchParams).toString()
        });

        // 2. Callback (untuk menutup modal, dsb)
        if (onSearchSubmit) {
            onSearchSubmit();
        }
    };

    // --- STYLE CONFIG ---
    // Jika isCompact (Modal), hilangkan margin dan shadow besar
    const containerClasses = isCompact 
        ? "bg-white p-2" 
        : "bg-white shadow-2xl rounded-[2rem] p-6 md:p-8 border border-gray-100";
    
    const wrapperClasses = isCompact
        ? "w-full"
        : "w-full max-w-7xl mx-auto mt-8 relative z-30 px-4 md:px-0";

    return (
        <div className={wrapperClasses}>
            
            {/* MAIN CARD */}
            <div className={containerClasses}>
                
                {/* 1. TRIP MODE TABS */}
                <div className="flex gap-8 mb-6 border-b border-gray-100 pb-4">
                    <label className="flex items-center gap-3 cursor-pointer group select-none">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${!isRoundTrip ? 'border-red-600' : 'border-gray-300 group-hover:border-gray-400'}`}>
                            {!isRoundTrip && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                        </div>
                        <input type="radio" name="tripMode" checked={!isRoundTrip} onChange={() => setIsRoundTrip(false)} className="hidden" />
                        <span className={`text-sm font-bold ${!isRoundTrip ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`}>
                            Sekali Jalan
                        </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group select-none">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isRoundTrip ? 'border-red-600' : 'border-gray-300 group-hover:border-gray-400'}`}>
                            {isRoundTrip && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                        </div>
                        <input type="radio" name="tripMode" checked={isRoundTrip} onChange={() => setIsRoundTrip(true)} className="hidden" />
                        <span className={`text-sm font-bold ${isRoundTrip ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`}>
                            Pulang Pergi
                        </span>
                    </label>
                </div>

                {/* 2. GRID UTAMA */}
                {/* Kita sesuaikan grid untuk modal agar lebih responsif di layar sempit */}
                <div className={`grid grid-cols-1 gap-4 items-end ${isCompact ? 'xl:grid-cols-2' : 'xl:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_minmax(0,1.3fr)_auto]'}`}>
                    
                    {/* DARI */}
                    <div className="w-full">
                        <BoxLabel label="Dari" />
                        <AirportCombobox 
                            airports={airports} 
                            value={origin} 
                            onChange={setOrigin} 
                            placeholder="Jakarta (JKT)" 
                        />
                    </div>

                    {/* TOMBOL SWAP (Hidden di Compact/Modal jika sempit, atau disesuaikan) */}
                    <div className={`flex justify-center mb-[5px] relative z-10 ${isCompact ? 'hidden xl:flex xl:col-span-2' : ''}`}>
                        <button 
                            onClick={handleSwap} 
                            className="p-3 rounded-full bg-gray-50 text-gray-400 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm transform hover:rotate-180"
                            title="Tukar Lokasi"
                        >
                            <FiRefreshCw className="text-lg" />
                        </button>
                    </div>

                    {/* KE */}
                    <div className="w-full">
                        <BoxLabel label="Ke" />
                        <AirportCombobox 
                            icon={<FiMapPin className="text-blue-500 text-xl" />} 
                            airports={airports} 
                            value={destination} 
                            onChange={setDestination} 
                            placeholder="Denpasar (DPS)" 
                        />
                    </div>

                    {/* PERGI */}
                    <div className="w-full">
                        <BoxLabel label="Pergi" />
                        <CalendarSelector 
                            selectedDate={departureDate}
                            onChange={setDepartureDate}
                            minDate={today}
                        />
                    </div>

                    {/* PULANG */}
                    <div 
                        onClick={() => !isRoundTrip && setIsRoundTrip(true)} 
                        className={`w-full ${!isRoundTrip ? 'cursor-pointer group' : ''}`}
                    >
                        <BoxLabel label="Pulang" />
                        <CalendarSelector 
                            selectedDate={returnDate}
                            onChange={setReturnDate}
                            minDate={addDays(departureDate, 1)}
                            disabled={!isRoundTrip}
                            placeholder={!isRoundTrip ? "Pesan Pulang-Pergi" : "Pilih Tanggal"}
                        />
                    </div>

                    {/* PENUMPANG & KELAS */}
                    <div className={`w-full ${isCompact ? 'xl:col-span-2' : ''}`}>
                        <BoxLabel label="Penumpang & Kelas" />
                        <PassengerSelector 
                            adults={adults} 
                            children={children} 
                            infants={infants} 
                            seatClass={seatClass} 
                            onUpdate={(a, c, i, s) => { setAdults(a); setChildren(c); setInfants(i); setSeatClass(s); }} 
                        />
                    </div>

                    {/* TOMBOL CARI */}
                    <div className={`w-full ${isCompact ? 'xl:col-span-2' : 'xl:w-auto'}`}>
                        <button 
                            onClick={handleSearch}
                            disabled={loadingData}
                            className="w-full h-[54px] bg-red-600 text-white px-6 rounded-2xl font-bold text-lg shadow-lg hover:bg-red-700 hover:shadow-red-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loadingData ? (
                                <FiRefreshCw className="animate-spin text-xl" />
                            ) : (
                                <>
                                    <FiSearch className="text-xl" />
                                    <span className={isCompact ? "" : "xl:hidden"}>Cari Penerbangan</span>
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};