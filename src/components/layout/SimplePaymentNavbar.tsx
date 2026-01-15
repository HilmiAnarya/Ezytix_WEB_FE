import React from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import ezyRed from "../../assets/images/ezyred.png";

export const SimplePaymentNavbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200 h-16 flex items-center fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex justify-between items-center">
        
        {/* KIRI: Logo & Back */}
        <div className="flex items-center gap-4">
            {/* Ganti dengan Logo Image projectmu jika ada */}
            <Link to="/" className="flex items-center">
                      <img 
                        src={ezyRed} 
                        alt="Ezytix Logo" 
                        className="h-8 md:h-9 w-auto hover:opacity-80 transition" 
                      />
                    </Link>
        </div>

        {/* KANAN: Title Halaman */}
        <div>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Payment Session
            </span>
        </div>

      </div>
    </nav>
  );
};