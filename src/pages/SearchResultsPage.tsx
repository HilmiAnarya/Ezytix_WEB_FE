/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, createSearchParams, useLocation } from "react-router-dom"; 
import { SearchResultsNavbar } from "../components/layout/SearchResultsNavbar";
import { SearchSummary } from "../components/sections/SearchSummary";
import { FilterBar } from "../components/sections/FilterBar";
import { FlightCard } from "../components/ui/FlightCard";
import { EditSearchModal } from "../components/features/search/EditSearchModal"; 
import { WarningModal } from "../components/common/WarningModal"; // [NEW] Import Modal
import { flightService } from "../services/flightService";
import { airportService } from "../services/airportService"; 
import { Flight } from "../types/api";
import { FiAlertCircle, FiSearch, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext"; // [NEW] Import Auth

const SearchResultsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation(); // [NEW] Untuk mendapatkan full URL

    const { user } = useAuth(); // [NEW] Ambil data user aktif
    
    // --- STATE DATA ---
    const [flights, setFlights] = useState<Flight[]>([]);
    const [selectedOutboundFlight, setSelectedOutboundFlight] = useState<Flight | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- STATE MODAL ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false); // [NEW] State Modal Login

    // --- STATE HEADER CONTEXT ---
    const [headerContext, setHeaderContext] = useState({
        originCode: "...",
        originCity: "Memuat...",
        destinationCode: "...",
        destinationCity: "Memuat...",
        dateFormatted: "...",
        passengers: 1,
        seatClass: "Economy",
        isReturnPhase: false 
    });

    // --- FETCHING LOGIC ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const originIdStr = searchParams.get("origin");
            const destinationIdStr = searchParams.get("destination");
            const departureDateStr = searchParams.get("departure_date");
            const returnDateStr = searchParams.get("return_date");
            const selectedOutboundIdStr = searchParams.get("selected_outbound_flight_id");

            const adults = Number(searchParams.get("adults")) || 1;
            const children = Number(searchParams.get("children")) || 0;
            const infants = Number(searchParams.get("infants")) || 0;
            const seatClass = searchParams.get("seat_class") || "economy";

            if (!originIdStr || !destinationIdStr || !departureDateStr) {
                setError("Parameter pencarian tidak lengkap.");
                setLoading(false);
                return;
            }

            const isReturnPhase = !!(returnDateStr && selectedOutboundIdStr);

            try {
                const fetchOriginId = isReturnPhase ? Number(destinationIdStr) : Number(originIdStr);
                const fetchDestinationId = isReturnPhase ? Number(originIdStr) : Number(destinationIdStr);
                const fetchDateStr = isReturnPhase ? returnDateStr! : departureDateStr;

                const totalPassengers = adults + children + infants;

                const promises: Promise<any>[] = [
                    airportService.getAirports(), 
                    flightService.searchFlights({ 
                        originAirportId: fetchOriginId,
                        destinationAirportId: fetchDestinationId,
                        departureDate: new Date(fetchDateStr), 
                        passengerCount: totalPassengers, 
                        seatClass: seatClass as any
                    })
                ];

                if (isReturnPhase) {
                    promises.push(flightService.getFlightById(Number(selectedOutboundIdStr)));
                }

                const results = await Promise.all(promises);
                
                const airportsData = results[0];
                const flightsData = results[1];
                const outboundFlightData = isReturnPhase ? results[2] : null;

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
                    passengers: totalPassengers,
                    seatClass: seatClass.charAt(0).toUpperCase() + seatClass.slice(1),
                    isReturnPhase: isReturnPhase
                });

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
        // [NEW] Cek status login
        if (!user) {
            setIsWarningModalOpen(true);
            return; // Hentikan proses jika belum login
        }

        const returnDateStr = searchParams.get("return_date");
        const selectedOutboundIdStr = searchParams.get("selected_outbound_flight_id");
        
        const currentParams = Object.fromEntries(searchParams.entries());
        
        if (returnDateStr && !selectedOutboundIdStr) {
            setSearchParams({
                ...currentParams, 
                selected_outbound_flight_id: flight.id.toString()
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const outboundId = selectedOutboundIdStr || flight.id;
            const inboundId = selectedOutboundIdStr ? flight.id : undefined;

            const bookingParams: any = {
                outbound_id: outboundId.toString(),
                adults: searchParams.get("adults") || "1",     
                children: searchParams.get("children") || "0", 
                infants: searchParams.get("infants") || "0",   
                seat_class: searchParams.get("seat_class") || "economy"
            };

            if (inboundId) {
                bookingParams.inbound_id = inboundId.toString();
            }

            navigate({
                pathname: "/booking",
                search: createSearchParams(bookingParams).toString()
            });
        }
    };

    const handleFilterChange = (filters: any) => console.log("Filter:", filters);
    
    const handleEditSearch = () => setIsEditModalOpen(true);

    // [NEW] HANDLER UNTUK TOMBOL DI DALAM MODAL
    const handleLoginRedirect = () => {
        // Arahkan ke login page. 
        // Note: AuthContext milikmu otomatis menyimpan `sessionStorage.setItem("lastPath", location.pathname)`
        // Jadi ketika login sukses, user akan otomatis dikembalikan ke halaman pencarian tiket.
        navigate("/login");
    };

    const editSearchInitialValues = useMemo(() => {
        return {
            origin: { id: Number(searchParams.get("origin")), code: headerContext.originCode, city_name: headerContext.originCity } as any,
            destination: { id: Number(searchParams.get("destination")), code: headerContext.destinationCode, city_name: headerContext.destinationCity } as any,
            departureDate: searchParams.get("departure_date") || "",
            returnDate: searchParams.get("return_date") || "",
            adults: Number(searchParams.get("adults")) || 1,
            children: Number(searchParams.get("children")) || 0,
            infants: Number(searchParams.get("infants")) || 0,
            seatClass: searchParams.get("seat_class") || "economy",
        };
    }, [searchParams, headerContext]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <SearchResultsNavbar />

            <div className="pt-24 max-w-5xl mx-auto px-4 md:px-6 flex flex-col gap-6">
                
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

                <div className="sticky top-20 z-20 bg-gray-50/95 backdrop-blur-sm py-2 -mx-4 px-4 md:mx-0 md:px-0 space-y-2">
                    <h2 className="text-lg font-bold text-gray-800">
                        {headerContext.isReturnPhase ? "Pilih Penerbangan Pulang" : "Pilih Penerbangan Pergi"}
                    </h2>
                    <FilterBar onFilterChange={handleFilterChange} />
                </div>

                <div className="flex flex-col gap-4 min-h-[300px]">
                    
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

                    {!loading && !error && flights.length > 0 && (
                        flights.map((flight) => (
                            <FlightCard 
                                key={flight.id} 
                                flight={flight} 
                                selectedSeatClass={headerContext.seatClass} 
                                onSelect={() => handleSelectFlight(flight)} 
                            />
                        ))
                    )}
                </div>
            </div>

            {/* --- MODAL EDIT SEARCH --- */}
            <EditSearchModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)}
                initialValues={editSearchInitialValues}
            />

            {/* --- [NEW] LOGIN WARNING MODAL --- */}
            <WarningModal 
                open={isWarningModalOpen}
                onClose={() => setIsWarningModalOpen(false)}
                onLogin={handleLoginRedirect}
            />
        </div>
    );
};

export default SearchResultsPage;