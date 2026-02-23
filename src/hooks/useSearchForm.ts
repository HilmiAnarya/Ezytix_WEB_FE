/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { airportService } from "../services/airportService";
import { Airport } from "../types/api";

export interface SearchFormInitialValues {
    origin?: Airport;
    destination?: Airport;
    departureDate?: string;
    returnDate?: string;
    adults?: number;
    children?: number;
    infants?: number;
    seatClass?: string;
}

export const useSearchForm = (initialValues?: SearchFormInitialValues) => {
    const navigate = useNavigate();
    const [airports, setAirports] = useState<Airport[]>([]);
    const [loadingData, setLoadingData] = useState(true);
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

    useEffect(() => {
        if (initialValues) {
            if (initialValues.origin?.id) setOrigin(initialValues.origin);
            if (initialValues.destination?.id) setDestination(initialValues.destination);
            
            if (initialValues.departureDate) setDepartureDate(initialValues.departureDate);
            if (initialValues.returnDate) {
                setReturnDate(initialValues.returnDate);
                setIsRoundTrip(true);
            }
            if (initialValues.adults !== undefined) setAdults(initialValues.adults);
            if (initialValues.children !== undefined) setChildren(initialValues.children);
            if (initialValues.infants !== undefined) setInfants(initialValues.infants);
            if (initialValues.seatClass) setSeatClass(initialValues.seatClass);
        }
    }, [initialValues]); 

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const data = await airportService.getAirports();
                setAirports(data);
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
    }, []); 
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

    const handleSwap = () => {
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
    };

    const handleSearch = (onSuccess?: () => void) => {
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

        navigate({
            pathname: "/search",
            search: createSearchParams(searchParams).toString()
        });

        if (onSuccess) onSuccess();
    };

    return {
        airports,
        loadingData,
        isRoundTrip, setIsRoundTrip,
        origin, setOrigin,
        destination, setDestination,
        departureDate, setDepartureDate,
        returnDate, setReturnDate,
        adults, setAdults,
        children, setChildren,
        infants, setInfants,
        seatClass, setSeatClass,
        handleSwap,
        handleSearch,
        today,
        addDays
    };
};