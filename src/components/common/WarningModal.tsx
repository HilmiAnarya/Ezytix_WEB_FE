import React from "react";
import warningIcon from "../../assets/images/warningmodal.png"; 

interface WarningModalProps {
    open: boolean;
    onClose: () => void;
    onLogin: () => void;
    title?: string;
    message?: string;
    buttonText?: string;
}

export const WarningModal: React.FC<WarningModalProps> = ({
    open,
    onClose,
    onLogin,
    title = "Kamu harus login!",
    message = "Ups! Kamu harus masuk ke akunmu dulu ya untuk melanjutkan pemesanan tiket ini.",
    buttonText = "Ke Login Page",
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative z-10 bg-white rounded-2xl shadow-xl px-8 py-10 max-w-sm w-full mx-4 flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
                <h2 className="text-[22px] font-bold text-gray-900 mb-6">{title}</h2>
                <img src={warningIcon} alt="Warning" className="w-28 h-28 mb-6 object-contain" />
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">{message}</p>
                <button 
                    onClick={onLogin} 
                    className="w-48 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transform hover:-translate-y-0.5"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};