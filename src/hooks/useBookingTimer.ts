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

    let targetDate = new Date(targetDateStr).getTime();
    const now = new Date().getTime();
    if (targetDateStr.endsWith('Z')) {
       const diffHours = (targetDate - now) / (1000 * 60 * 60);
       if (diffHours > 7) { 
          const localString = targetDateStr.replace('Z', '');
          targetDate = new Date(localString).getTime();
       }
    }

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