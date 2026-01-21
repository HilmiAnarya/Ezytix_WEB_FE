// src/hooks/useBookingTimer.ts
import { useState, useEffect, useCallback } from 'react';

interface TimeLeft {
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
}

export const useBookingTimer = (targetDateStr: string) => {
  // 1. Definisikan fungsi kalkulasi (gunakan useCallback agar stabil)
  // Atau bisa juga didefinisikan di luar komponen jika tidak butuh props lain
  const calculateTimeLeft = useCallback(() => {
    // Validasi input
    if (!targetDateStr) {
      return { hours: '00', minutes: '00', seconds: '00', isExpired: true };
    }

    const targetDate = new Date(targetDateStr).getTime();
    const now = new Date().getTime();
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

  // 2. Lazy Initialization: Hitung nilai awal SAAT state dibuat
  // Ini menghindari pemanggilan setTimeLeft di useEffect pertama kali
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft());

  useEffect(() => {
    // 3. Setup Interval
    const timer = setInterval(() => {
      const result = calculateTimeLeft();
      setTimeLeft(result);

      // Jika expired, hentikan interval agar hemat resource
      if (result.isExpired) {
        clearInterval(timer);
      }
    }, 1000);

    // Cleanup saat unmount atau targetDateStr berubah
    return () => clearInterval(timer);
  }, [calculateTimeLeft]); // Dependency ke fungsi kalkulasi

  return timeLeft;
};