// src/hooks/useBookingTimer.ts
import { useState, useEffect, useCallback } from 'react';

interface TimeLeft {
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
}

export const useBookingTimer = (targetDateStr: string) => {
  const calculateTimeLeft = useCallback(() => {
    if (!targetDateStr) {
      return { hours: '00', minutes: '00', seconds: '00', isExpired: true };
    }

    // --- TIMEZONE HOTFIX START ---
    // Masalah: Backend mengirim Waktu Lokal (WIB) tapi dilabeli UTC ('Z').
    // Akibat: Browser menganggapnya UTC, lalu menambah +7 jam lagi -> Timer jadi 8 jam (1+7).
    // Solusi: Jika terjadi anomali offset, kita coba parse sebagai Local Time (buang 'Z').
    
    let targetDate = new Date(targetDateStr).getTime();
    const now = new Date().getTime();
    
    // Deteksi selisih jam. Jika selisihnya > 5 jam (padahal harusnya 1 jam), 
    // kemungkinan besar kena isu timezone +7.
    // Kita coba parse ulang stringnya dengan membuang 'Z' agar dibaca sebagai waktu lokal komputer.
    if (targetDateStr.endsWith('Z')) {
       // Cek estimasi kasar
       const diffHours = (targetDate - now) / (1000 * 60 * 60);
       if (diffHours > 7) { 
          // Hapus 'Z' agar browser membacanya sebagai "2023-xx-xxT18:00:00" (Local Time)
          // Browser tidak akan menambah +7 lagi karena dianggap sudah lokal.
          const localString = targetDateStr.replace('Z', '');
          targetDate = new Date(localString).getTime();
       }
    }
    // --- TIMEZONE HOTFIX END ---

    const difference = targetDate - now;

    if (difference <= 0) {
      return {
        hours: '00',
        minutes: '00',
        seconds: '00',
        isExpired: true,
      };
    }

    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      isExpired: false,
    };
  }, [targetDateStr]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const result = calculateTimeLeft();
      setTimeLeft(result);
      if (result.isExpired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return timeLeft;
};