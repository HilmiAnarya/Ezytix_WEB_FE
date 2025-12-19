import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; // Tambah useNavigate
import { SearchResultsNavbar } from "../components/layout/SearchResultsNavbar";
import { SearchSummary } from "../components/sections/SearchSummary";
import { FilterBar } from "../components/sections/FilterBar";
import { FlightCard } from "../components/ui/FlightCard";
import { flightService } from "../services/flightService";
import { airportService } from "../services/airportService"; 
import { Flight } from "../types/api";
import { FiAlertCircle, FiSearch, FiCheckCircle } from "react-icons/fi"; // Tambah icon

const SearchResultsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // --- STATE DATA ---
    const [flights, setFlights] = useState<Flight[]>([]);
    
    // State khusus untuk menyimpan data tiket pergi yang SUDAH dipilih (untuk ditampilkan saat cari tiket pulang)
    const [selectedOutboundFlight, setSelectedOutboundFlight] = useState<Flight | null>(null);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- STATE HEADER CONTEXT ---
    const [headerContext, setHeaderContext] = useState({
        originCode: "...",
        originCity: "Memuat...",
        destinationCode: "...",
        destinationCity: "Memuat...",
        dateFormatted: "...",
        passengers: 1,
        seatClass: "Economy",
        isReturnPhase: false // Flag untuk UI update
    });

    // --- FETCHING LOGIC ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            // 1. Ambil Parameter dari URL
            const originIdStr = searchParams.get("origin");
            const destinationIdStr = searchParams.get("destination");
            const departureDateStr = searchParams.get("departure_date");
            
            // Parameter Round Trip
            const returnDateStr = searchParams.get("return_date");
            const selectedOutboundIdStr = searchParams.get("selected_outbound_flight_id");

            const passengers = Number(searchParams.get("passengers")) || 1;
            const seatClass = searchParams.get("seat_class") || "economy";

            // Validasi Dasar
            if (!originIdStr || !destinationIdStr || !departureDateStr) {
                setError("Parameter pencarian tidak lengkap.");
                setLoading(false);
                return;
            }

            // 2. Tentukan Fase: Apakah sedang mencari tiket pulang?
            // Syarat: Ada tanggal pulang DAN user sudah memilih tiket pergi (ID-nya ada di URL)
            const isReturnPhase = !!(returnDateStr && selectedOutboundIdStr);

            try {
                // 3. LOGIC SWAPPING (The Brain) 🧠
                // Jika fase pulang, tukar Origin <-> Destination dan gunakan Tanggal Pulang
                const fetchOriginId = isReturnPhase ? Number(destinationIdStr) : Number(originIdStr);
                const fetchDestinationId = isReturnPhase ? Number(originIdStr) : Number(destinationIdStr);
                const fetchDateStr = isReturnPhase ? returnDateStr! : departureDateStr;

                // --- PARALLEL FETCHING ---
                // Siapkan promise array
                const promises: Promise<any>[] = [
                    airportService.getAirports(), 
                    flightService.searchFlights({ 
                        originAirportId: fetchOriginId,
                        destinationAirportId: fetchDestinationId,
                        departureDate: new Date(fetchDateStr), 
                        passengerCount: passengers,
                        seatClass: seatClass as any
                    })
                ];

                // Jika sedang fase pulang, kita perlu fetch detail tiket pergi yang sudah dipilih
                if (isReturnPhase) {
                    promises.push(flightService.getFlightById(Number(selectedOutboundIdStr)));
                }

                // Eksekusi semua request
                const results = await Promise.all(promises);
                
                const airportsData = results[0];
                const flightsData = results[1];
                // Hasil fetch flight detail ada di index 2 (jika ada)
                const outboundFlightData = isReturnPhase ? results[2] : null;

                // --- 4. SET HEADER CONTEXT ---
                const originAirport = airportsData.find((a: any) => a.id === fetchOriginId);
                const destAirport = airportsData.find((a: any) => a.id === fetchDestinationId);

                const dateObj = new Date(fetchDateStr);
                const dateFormatted = dateObj.toLocaleDateString('id-ID', { 
                    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' 
                });

                setHeaderContext({
                    originCode: originAirport?.code || "---",
                    originCity: originAirport?.city_name || "Unknown",
                    destinationCode: destAirport?.code || "---",
                    destinationCity: destAirport?.city_name || "Unknown",
                    dateFormatted: dateFormatted,
                    passengers: passengers,
                    seatClass: seatClass.charAt(0).toUpperCase() + seatClass.slice(1),
                    isReturnPhase: isReturnPhase
                });

                // --- 5. SET DATA ---
                setFlights(flightsData);
                setSelectedOutboundFlight(outboundFlightData);

            } catch (err) {
                console.error("Error fetching search data:", err);
                setError("Terjadi kesalahan saat memuat data penerbangan.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]); 


    // --- HANDLER: SAAT USER MEMILIH TIKET ---
    const handleSelectFlight = (flight: Flight) => {
        const returnDateStr = searchParams.get("return_date");
        const selectedOutboundIdStr = searchParams.get("selected_outbound_flight_id");
        
        // Skenario 1: User baru pilih tiket pergi, dan dia merencanakan pulang pergi (returnDate ada)
        if (returnDateStr && !selectedOutboundIdStr) {
            // Update URL untuk memicu useEffect (masuk fase Return)
            const newParams = new URLSearchParams(searchParams);
            newParams.set("selected_outbound_flight_id", flight.id.toString());
            
            setSearchParams(newParams);
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll ke atas agar user sadar halaman berubah
        } 
        // Skenario 2: User memilih tiket pulang (atau ini tiket sekali jalan/one-way) -> Lanjut Booking
        else {
            const outboundId = selectedOutboundIdStr || flight.id; // Jika one-way, flight.id adalah outbound
            const inboundId = selectedOutboundIdStr ? flight.id : null; // Jika return phase, flight.id adalah inbound

            // Navigasi ke halaman Booking
            navigate(`/booking?outbound_id=${outboundId}&inbound_id=${inboundId || ''}&passengers=${headerContext.passengers}&seat_class=${searchParams.get("seat_class")}`);
        }
    };


    const handleFilterChange = (filters: any) => console.log("Filter:", filters);
    const handleEditSearch = () => console.log("Edit Search Modal Open");

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <SearchResultsNavbar />

            <div className="pt-24 max-w-5xl mx-auto px-4 md:px-6 flex flex-col gap-6">
                
                {/* 1. SUMMARY BAR */}
                <SearchSummary 
                    originCode={headerContext.originCode}
                    originCity={headerContext.originCity}
                    destinationCode={headerContext.destinationCode}
                    destinationCity={headerContext.destinationCity}
                    dateFormatted={headerContext.dateFormatted}
                    passengers={headerContext.passengers}
                    seatClass={headerContext.seatClass}
                    onEditSearch={handleEditSearch}
                />

                {/* 2. SELECTED OUTBOUND FLIGHT (Hanya Muncul saat Fase Pulang) */}
                {headerContext.isReturnPhase && selectedOutboundFlight && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <FiCheckCircle className="text-2xl text-blue-600" />
                            <div>
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Penerbangan Pergi Terpilih</p>
                                <div className="flex items-center gap-2 font-bold text-gray-800">
                                    <span>{selectedOutboundFlight.airline.name}</span>
                                    <span className="text-gray-400">•</span>
                                    <span>{selectedOutboundFlight.departure_time.split('T')[1].substring(0,5)}</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => window.history.back()}
                            className="text-sm text-blue-600 font-semibold hover:underline"
                        >
                            Ubah
                        </button>
                    </div>
                )}

                {/* 3. FILTER & HEADER FASE */}
                <div className="sticky top-20 z-20 bg-gray-50/95 backdrop-blur-sm py-2 -mx-4 px-4 md:mx-0 md:px-0 space-y-2">
                    {/* Judul Fase agar user tidak bingung */}
                    <h2 className="text-lg font-bold text-gray-800">
                        {headerContext.isReturnPhase ? "Pilih Penerbangan Pulang" : "Pilih Penerbangan Pergi"}
                    </h2>
                    <FilterBar onFilterChange={handleFilterChange} />
                </div>

                {/* 4. LIST PENERBANGAN */}
                <div className="flex flex-col gap-4 min-h-[300px]">
                    
                    {/* LOADING */}
                    {loading && (
                        <>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-xl h-40 animate-pulse border border-gray-100 p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="w-1/4 h-8 bg-gray-200 rounded"></div>
                                        <div className="w-1/4 h-8 bg-gray-200 rounded"></div>
                                        <div className="w-1/4 h-8 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded mb-4"></div>
                                    <div className="w-1/2 h-4 bg-gray-100 rounded mx-auto"></div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* ERROR */}
                    {!loading && error && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-8 text-center">
                            <FiAlertCircle className="text-4xl text-red-500 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-red-700">Gagal Memuat Data</h3>
                            <p className="text-red-600 text-sm">{error}</p>
                            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">
                                Coba Lagi
                            </button>
                        </div>
                    )}

                    {/* EMPTY */}
                    {!loading && !error && flights.length === 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiSearch className="text-3xl text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Penerbangan Tidak Ditemukan</h3>
                            <p className="text-gray-500 mt-2 max-w-md mx-auto">
                                Maaf, kami tidak menemukan jadwal penerbangan untuk rute ini.
                            </p>
                        </div>
                    )}

                    {/* SUCCESS LIST */}
                    {!loading && !error && flights.length > 0 && (
                        flights.map((flight) => (
                            <FlightCard 
                                key={flight.id} 
                                flight={flight} 
                                // PENTING: Passing handler ini ke komponen FlightCard
                                onSelect={() => handleSelectFlight(flight)} 
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResultsPage;