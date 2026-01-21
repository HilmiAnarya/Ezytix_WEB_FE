export const formatCurrency = (amount: string | number) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Format 24 jam (14:30)
  });
};

// Formatter Global (Tetap Year Numeric / 4 Digit)
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  });
};

// [NEW] Formatter Khusus Payment Card (Year 2-Digit)
export const formatPaymentDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'short', 
    day: 'numeric', 
    month: 'short', 
    year: '2-digit' // Output: "Rab, 5 Okt 25"
  });
};