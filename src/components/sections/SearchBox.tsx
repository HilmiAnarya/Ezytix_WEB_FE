// src/components/sections/SearchBox.tsx
import React from "react";
import { FiSearch, FiMapPin, FiUsers } from "react-icons/fi";

export const SearchBox: React.FC = () => {
    return (
        <div className="w-full max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-6 mt-6">

            {/* TRAVEL MODE */}
            <div className="flex gap-6 mb-4 text-sm">
                <label className="flex items-center gap-2">
                    <input type="radio" name="mode" defaultChecked />
                    Sekali Jalan
                </label>
                <label className="flex items-center gap-2">
                    <input type="radio" name="mode" />
                    Pulang Pergi
                </label>
            </div>

            {/* FORM GRID */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                {/* DARI */}
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-3 rounded-xl">
                    <FiMapPin className="text-red-500 text-xl" />
                    <input
                        type="text"
                        placeholder="Jakarta, JKTC"
                        className="bg-transparent w-full outline-none text-sm"
                    />
                </div>

                {/* KE */}
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-3 rounded-xl">
                    <FiMapPin className="text-red-500 text-xl" />
                    <input
                        type="text"
                        placeholder="Denpasar-Bali, DPS"
                        className="bg-transparent w-full outline-none text-sm"
                    />
                </div>

                {/* PERGI */}
                <input
                    type="date"
                    className="bg-gray-100 px-3 py-3 rounded-xl text-sm outline-none"
                />

                {/* PULANG */}
                <input
                    type="date"
                    className="bg-gray-100 px-3 py-3 rounded-xl text-sm outline-none"
                />

                {/* PENUMPANG */}
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-3 rounded-xl">
                    <FiUsers className="text-red-500 text-xl" />
                    <select className="bg-transparent w-full text-sm outline-none">
                        <option>1, Ekonomi</option>
                    </select>
                </div>
            </div>

            {/* SEARCH BUTTON */}
            <div className="flex justify-end mt-4">
                <button className="px-6 py-3 bg-red-500 rounded-xl text-white flex items-center gap-2 hover:bg-red-600">
                    <FiSearch />
                    Cari Tiket
                </button>
            </div>
        </div>
    );
};
