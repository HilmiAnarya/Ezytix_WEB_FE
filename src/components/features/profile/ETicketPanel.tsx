import React from "react";

interface ETicketPanelProps {
    onNavigateToRiwayat: () => void;
}

export const ETicketPanel: React.FC<ETicketPanelProps> = ({ onNavigateToRiwayat }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-8 flex-1 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">E-tiket aktif</h2>
            <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600">
                    Informasi E-tiket dialihkan ke halaman{" "}
                    <button
                        onClick={onNavigateToRiwayat}
                        className="text-blue-600 hover:text-blue-700 hover:underline font-semibold focus:outline-none"
                    >
                        Riwayat Pemesanan
                    </button>
                </p>
            </div>
        </div>
    );
};