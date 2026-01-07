/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { FiSearch, FiRefreshCw, FiMapPin } from "react-icons/fi";
import { useNavigate, createSearchParams } from "react-router-dom"; // Tambah createSearchParams
import { airportService } from "../../services/airportService";
import { Airport } from "../../types/api";
import { AirportCombobox } from "../ui/AirportCombobox";
import { PassengerSelector } from "../ui/PassengerSelector";
import { CalendarSelector } from "../ui/CalendarSelector";

// --- 1. LABEL BOX ---
const BoxLabel: React.FC<{ label: string }> = ({ label }) => (
    <div className="mb-2 w-full text-left pl-1">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            {label}
        </span>
    </div>
);

export const SearchBox: React.FC = () => {
    const navigate = useNavigate();
    
    // STATE
    const [airports, setAirports] = useState<Airport[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    
    // FORM STATE
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [origin, setOrigin] = useState<Airport | null>(null);
    const [destination, setDestination] = useState<Airport | null>(null);
    
    const today = new Date().toISOString().split('T')[0];
    const [departureDate, setDepartureDate] = useState<string>(today);
    const [returnDate, setReturnDate] = useState<string>(""); 

    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [seatClass, setSeatClass] = useState("economy");

    // FETCH DATA
    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const data = await airportService.getAirports();
                setAirports(data);
                if (data.length > 0) {
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
    }, []);

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

    // --- [REFACTOR UTAMA] Update Logic Navigasi ---
    const handleSearch = () => {
        if (!origin || !destination) return alert("Pilih bandara asal & tujuan");
        if (origin.id === destination.id) return alert("Bandara tidak boleh sama");
        if (isRoundTrip && !returnDate) return alert("Pilih tanggal pulang");

        // Kirim detail penumpang terpisah, BUKAN digabung
        const searchParams: any = {
            origin: origin.id.toString(),
            destination: destination.id.toString(),
            departure_date: departureDate,
            adults: adults.toString(),       // <-- FIXED
            children: children.toString(),   // <-- FIXED
            infants: infants.toString(),     // <-- FIXED
            seat_class: seatClass,
        };

        if (isRoundTrip && returnDate) {
            searchParams.return_date = returnDate;
        }

        navigate({
            pathname: "/search", // Arahkan ke Search Results Page
            search: createSearchParams(searchParams).toString()
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto mt-8 relative z-30 px-4 md:px-0">
            
            {/* MAIN CARD */}
            <div className="bg-white shadow-2xl rounded-[2rem] p-6 md:p-8 border border-gray-100">
                
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
                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_minmax(0,1.3fr)_auto] gap-4 items-end">
                    
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

                    {/* TOMBOL SWAP */}
                    <div className="flex justify-center mb-[5px] relative z-10">
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
                    <div className="w-full">
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
                    <div className="w-full xl:w-auto">
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
                                    <span className="xl:hidden">Cari Penerbangan</span>
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};