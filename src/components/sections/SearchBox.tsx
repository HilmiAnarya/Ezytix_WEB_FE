import React, { useEffect, useState } from "react";
import { FiSearch, FiCalendar, FiRefreshCw, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { airportService } from "../../service/airportService";
import { Airport } from "../../types/api";
import { AirportCombobox } from "../ui/AirportCombobox";
import { PassengerSelector } from "../ui/PassengerSelector";
import { CalendarSelector } from "../ui/CalendarSelector";

export const SearchBox: React.FC = () => {
    const navigate = useNavigate();
    
    // STATE
    const [airports, setAirports] = useState<Airport[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    
    // FORM STATE
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [origin, setOrigin] = useState<Airport | null>(null);
    const [destination, setDestination] = useState<Airport | null>(null);
    
    // Default Tanggal: HARI INI
    const today = new Date().toISOString().split('T')[0];
    const [departureDate, setDepartureDate] = useState<string>(today);
    const [returnDate, setReturnDate] = useState<string>(""); 

    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [seatClass, setSeatClass] = useState("economy");

    // --- FETCH DATA & AUTO SELECT (SAT-SET LOGIC) ---
    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const data = await airportService.getAirports();
                setAirports(data);

                // --- LOGIC SAT-SET ---
                if (data.length > 0) {
                    // 1. Cari Jakarta (CGK) sebagai Default Origin
                    const defaultOrigin = data.find(a => a.code === 'CGK') || data[0];
                    setOrigin(defaultOrigin);

                    // 2. Cari Bali (DPS) sebagai Default Destination
                    // Jika DPS gak ada, ambil bandara kedua di list (asal bukan origin)
                    const defaultDest = data.find(a => a.code === 'DPS') || data.find(a => a.id !== defaultOrigin.id);
                    
                    if (defaultDest) {
                        setDestination(defaultDest);
                    }
                }
            } catch (error) {
                console.error("Gagal load bandara", error);
            } finally {
                setLoadingData(false);
            }
        };
        fetchAirports();
    }, []);

    // --- SMART DATE LOGIC ---
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
    }, [isRoundTrip]);

    useEffect(() => {
        if (isRoundTrip && returnDate && returnDate <= departureDate) {
            setReturnDate(addDays(departureDate, 1));
        }
    }, [departureDate]);

    // HANDLERS
    const handleSwap = () => {
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
    };

    const handleSearch = () => {
        if (!origin || !destination) {
            alert("Mohon pilih bandara asal dan tujuan.");
            return;
        }
        if (origin.id === destination.id) {
            alert("Bandara asal dan tujuan tidak boleh sama.");
            return;
        }
        if (isRoundTrip && !returnDate) {
            alert("Mohon pilih tanggal pulang.");
            return;
        }

        const params = new URLSearchParams();
        params.append("origin", origin.id.toString());
        params.append("destination", destination.id.toString());
        params.append("date", departureDate);
        params.append("passengers", (adults + children).toString());
        params.append("seat_class", seatClass);
        if (isRoundTrip && returnDate) params.append("return_date", returnDate);

        navigate(`/search?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-7xl mx-auto bg-white shadow-xl rounded-3xl p-6 mt-8 relative z-30 border border-gray-100">
            
            {/* TRIP MODE */}
            <div className="flex gap-6 mb-4 px-1">
                <label className="flex items-center gap-2 cursor-pointer group select-none">
                    <input type="radio" name="tripMode" checked={!isRoundTrip} onChange={() => setIsRoundTrip(false)} className="accent-red-500 w-4 h-4 cursor-pointer" />
                    <span className={`text-sm font-bold transition-colors ${!isRoundTrip ? 'text-gray-900' : 'text-gray-400 group-hover:text-red-500'}`}>Sekali Jalan</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group select-none">
                    <input type="radio" name="tripMode" checked={isRoundTrip} onChange={() => setIsRoundTrip(true)} className="accent-red-500 w-4 h-4 cursor-pointer" />
                    <span className={`text-sm font-bold transition-colors ${isRoundTrip ? 'text-gray-900' : 'text-gray-400 group-hover:text-red-500'}`}>Pulang Pergi</span>
                </label>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_auto_1.5fr_1.1fr_1.1fr_1.4fr_auto] gap-3 items-center">
                
                {/* 1. DARI (Combobox - Auto Filled) */}
                <AirportCombobox label="Dari" airports={airports} value={origin} onChange={setOrigin} placeholder="Jakarta (JKT)" />

                {/* SWAP */}
                <div className="flex justify-center -my-2 xl:my-0 relative z-10">
                   <button onClick={handleSwap} className="bg-gray-50 p-2 rounded-full hover:bg-red-50 hover:text-red-600 text-gray-400 transition border border-gray-200 shadow-sm">
                       <FiRefreshCw className="text-lg" />
                   </button>
                </div>

                {/* 2. KE (Combobox - Auto Filled) */}
                <AirportCombobox label="Ke" icon={<FiMapPin className="text-blue-500 text-xl flex-shrink-0" />} airports={airports} value={destination} onChange={setDestination} placeholder="Denpasar (DPS)" />

                {/* 3. PERGI (Calendar Custom - Auto Today) */}
                <CalendarSelector 
                    label="Pergi"
                    selectedDate={departureDate}
                    onChange={setDepartureDate}
                    minDate={today}
                />

                {/* 4. PULANG (Calendar Custom) */}
                <div onClick={() => !isRoundTrip && setIsRoundTrip(true)} className="w-full">
                    <CalendarSelector 
                        label="Pulang"
                        selectedDate={returnDate}
                        onChange={setReturnDate}
                        minDate={addDays(departureDate, 1)}
                        disabled={!isRoundTrip}
                        placeholder="Pilih Tanggal"
                    />
                </div>

                {/* 5. PENUMPANG */}
                <PassengerSelector adults={adults} children={children} infants={infants} seatClass={seatClass} onUpdate={(a, c, i, s) => { setAdults(a); setChildren(c); setInfants(i); setSeatClass(s); }} />

                {/* 6. TOMBOL CARI */}
                <button 
                    onClick={handleSearch}
                    disabled={loadingData}
                    className="h-[72px] bg-red-600 text-white px-8 rounded-xl font-bold text-lg shadow-lg hover:bg-red-700 hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
                >
                    {loadingData ? <FiRefreshCw className="animate-spin text-2xl" /> : <FiSearch className="text-2xl" />}
                </button>

            </div>
        </div>
    );
};