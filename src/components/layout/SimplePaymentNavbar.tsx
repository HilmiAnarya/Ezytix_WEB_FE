import React from "react";
import { Link } from "react-router-dom";
// import { FiChevronLeft } from "react-icons/fi";
import ezyRed from "../../assets/images/ezyred.png";
import { CountdownTimer } from "../ui/CountdownTimer";

interface SimplePaymentNavbarProps {
  expiryTime?: string; 
}

export const SimplePaymentNavbar: React.FC<SimplePaymentNavbarProps> = ({ expiryTime }) => {
  return (
    <nav className="bg-white border-b border-gray-200 h-16 flex items-center fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex justify-between items-center">
        <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <img 
                src={ezyRed} 
                alt="Ezytix Logo" 
                className="h-8 md:h-9 w-auto hover:opacity-80 transition" 
              />
            </Link>
        </div>
        <div>
            {expiryTime ? (
                <CountdownTimer targetDate={expiryTime} className="shadow-sm" />
            ) : (
                <div className="h-10 w-32 bg-gray-100 rounded-lg animate-pulse hidden md:block"></div>
            )}
        </div>
      </div>
    </nav>
  );
};