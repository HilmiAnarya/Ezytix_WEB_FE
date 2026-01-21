// src/components/ui/CountdownTimer.tsx
import React from 'react';
import { Clock } from 'lucide-react';
import { useBookingTimer } from '../../hooks/useBookingTimer';
import { ExpiredModal } from './ExpiredModal';

interface CountdownTimerProps {
    targetDate: string; // ISO String dari Backend
    className?: string; // Untuk custom styling tambahan
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, className = "" }) => {
    const { hours, minutes, seconds, isExpired } = useBookingTimer(targetDate);

    return (
        <>
            <div className={`flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium border border-red-100 ${className}`}>
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Sisa Waktu:</span>
                <span className="font-mono text-base font-bold tracking-wider">
                    {hours}:{minutes}:{seconds}
                </span>
            </div>

            {/* Modal akan otomatis muncul jika isExpired == true */}
            <ExpiredModal isOpen={isExpired} />
        </>
    );
};