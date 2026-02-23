import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

interface ExpiredModalProps {
    isOpen: boolean;
}

export const ExpiredModal: React.FC<ExpiredModalProps> = ({ isOpen }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in duration-200">
                <div className="flex justify-center mb-4">
                    <div className="bg-red-100 p-3 rounded-full">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Waktu Pembayaran Habis
                </h3>

                <p className="text-gray-600 mb-6">
                    Maaf, batas waktu pembayaran untuk pesanan ini telah berakhir.
                    Pesanan otomatis dibatalkan oleh sistem. Silakan lakukan pemesanan ulang.
                </p>

                <button
                    onClick={handleBackToHome}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
                >
                    Kembali ke Beranda
                </button>
            </div>
        </div>
    );
};