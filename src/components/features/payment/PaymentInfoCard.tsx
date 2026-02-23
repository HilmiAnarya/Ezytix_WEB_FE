import React from "react";
import { Copy, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { formatCurrency, formatPaymentDate } from "../../../utils/formatters";
import { useBookingTimer } from "../../../hooks/useBookingTimer";
import { InitiatePaymentResponse } from "../../../types/payment";

interface PaymentInfoCardProps {
  orderId: string;
  bookingDate: string;
  amount: number;
  status: string;
  expiryTime: string;
  paymentMethodName: string;
  paymentData?: InitiatePaymentResponse;
}

export const PaymentInfoCard: React.FC<PaymentInfoCardProps> = ({
  orderId,
  bookingDate,
  amount,
  status,
  expiryTime,
  paymentMethodName,
  paymentData
}) => {
  const { hours, minutes, seconds, isExpired } = useBookingTimer(expiryTime);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin!`);
  };

  const getStatusColor = (s: string) => {
    if (s === 'paid') return 'text-green-600';
    if (s === 'expired') return 'text-red-600';
    return 'text-orange-600';
  };
  const renderPaymentContent = () => {
    if (!paymentData) return <div className="text-gray-400 italic text-sm">Menunggu data pembayaran...</div>;

    if (paymentData.qris) {
      return (
        <div className="flex flex-col items-center justify-center py-6 space-y-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="bg-white p-3 rounded-xl border-2 border-dashed border-gray-300 shadow-sm">
            <QRCode
              value={paymentData.qris.qr_url}
              size={160}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox={`0 0 256 256`}
            />
          </div>
          <p className="text-xs text-gray-500 text-center font-medium">
            Scan QR untuk membayar via GoPay/OVO/DANA
          </p>
        </div>
      );
    }

    if (paymentData.mandiri_bill) {
      return (
        <div className="space-y-4 py-2">
          <div>
            <span className="text-xs text-gray-500 font-medium block mb-1">Kode Perusahaan (Biller Code)</span>
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
              <span className="font-mono text-lg font-bold text-blue-900">
                {paymentData.mandiri_bill.biller_code}
              </span>
              <button
                onClick={() => handleCopy(paymentData.mandiri_bill!.biller_code, "Kode Perusahaan")}
                className="p-2 hover:bg-blue-100 rounded-md transition-colors"
              >
                <Copy size={16} className="text-blue-600" />
              </button>
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block mb-1">Kode Bayar (Bill Key)</span>
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border-2 border-blue-500 shadow-sm">
              <span className="font-mono text-lg font-bold text-gray-900 tracking-wider">
                {paymentData.mandiri_bill.bill_key}
              </span>
              <button
                onClick={() => handleCopy(paymentData.mandiri_bill!.bill_key, "Kode Bayar")}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Copy size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (paymentData.virtual_account) {
      return (
        <div className="py-2">
          <span className="text-xs text-gray-500 font-medium block mb-1">Nomor Virtual Account</span>
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border-2 border-red-500 shadow-sm">
            <span className="font-mono text-2xl font-bold text-gray-900 tracking-wide">
              {paymentData.virtual_account.va_number}
            </span>
            <button
              onClick={() => handleCopy(paymentData.virtual_account!.va_number, "Nomor VA")}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Copy size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      );
    }

    return <div className="text-red-500 text-sm">Metode pembayaran tidak dikenali.</div>;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order saya</span>
          </div>
          <p className="font-semibold text-gray-900 tracking-wide text-sm">{orderId}</p>
        </div>
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <div className="flex items-center gap-2">
              {isExpired ? <AlertCircle className="w-4 h-4 text-red-600" /> : null}
              <span className={`font-medium capitalize ${getStatusColor(status)}`}>
                {isExpired ? "Waktu Habis" : (status === 'pending' ? 'Belum Dibayar' : status)}
              </span>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tanggal Pemesanan</span>
            <span className="font-medium text-gray-900">
              {formatPaymentDate(bookingDate)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Pembayaran</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(amount)}
            </span>
          </div>
          <div className="flex justify-between text-sm items-center bg-red-50 p-2 rounded-lg border border-red-100">
            <span className="text-gray-600 flex items-center gap-1">
              <Clock className="w-3 h-3 text-red-500" /> Sisa Waktu
            </span>
            <span className={`font-medium font-mono ${isExpired ? 'text-red-600' : 'text-red-700'}`}>
              {hours}:{minutes}:{seconds}
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-xs">
              1
            </div>
            <div>
              <p className="text-xs text-gray-400">Lakukan Pembayaran via</p>
              <p className="font-semibold text-gray-800 text-sm">{paymentMethodName}</p>
            </div>
          </div>
          {renderPaymentContent()}
        </div>
      </div>
    </div>
  );
};