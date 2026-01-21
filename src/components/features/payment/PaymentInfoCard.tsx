import React from "react";
import { Copy, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import QRCode from "react-qr-code";

// [UPDATED] Import formatPaymentDate yang baru
import { formatCurrency, formatPaymentDate } from "../../../utils/formatters";
import { useBookingTimer } from "../../../hooks/useBookingTimer";

interface PaymentInfoCardProps {
  orderId: string;
  bookingDate: string; // ISO String
  amount: number;
  status: string;
  expiryTime: string;
  paymentMethod: string;
  paymentCode?: string;
  qrString?: string;
}

export const PaymentInfoCard: React.FC<PaymentInfoCardProps> = ({
  orderId,
  bookingDate,
  amount,
  status,
  expiryTime,
  paymentMethod,
  paymentCode,
  qrString
}) => {

  const { hours, minutes, seconds, isExpired } = useBookingTimer(expiryTime);

  const handleCopy = () => {
    if (paymentCode) {
      navigator.clipboard.writeText(paymentCode);
      toast.success("Nomor pembayaran berhasil disalin!");
    }
  };

  const getStatusColor = (s: string) => {
    if (s === 'paid') return 'text-green-600';
    if (s === 'expired') return 'text-red-600';
    return 'text-foreground';
  };

  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
      <div className="p-6 space-y-4">

        {/* Order ID */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order saya</span>
          </div>
          <p className="font-semibold text-foreground tracking-wide">{orderId}</p>
        </div>

        {/* Details Section */}
        <div className="space-y-3 border-t border-border pt-4">

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <div className="flex items-center gap-2">
              {isExpired ? <AlertCircle className="w-4 h-4 text-red-600" /> : null}
              <span className={`font-medium capitalize ${getStatusColor(status)}`}>
                {isExpired ? "Waktu Habis" : (status === 'pending' ? 'Belum Dibayar' : status)}
              </span>
            </div>
          </div>

          {/* [UPDATED] Gunakan formatPaymentDate */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tanggal Pemesanan</span>
            <span className="font-medium text-foreground">
              {formatPaymentDate(bookingDate)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Pembayaran</span>
            <span className="font-medium text-foreground">
              {formatCurrency(amount)}
            </span>
          </div>

          <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> Waktu yang tersisa
            </span>
            <span className={`font-medium font-mono ${isExpired ? 'text-red-600' : 'text-primary'}`}>
              {hours}j {minutes}m {seconds}d
            </span>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="space-y-3 border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">
            {qrString ? "Scan QR Code" : "Transfer ke"}
          </span>

          <div className="flex items-center gap-3">
            <div className="bg-secondary px-3 py-2 rounded-md">
              <span className="font-bold text-sm text-primary uppercase">
                {paymentMethod}
              </span>
            </div>
            <span className="text-sm font-medium text-foreground uppercase">
              {paymentMethod === 'QRIS' ? 'QRIS' : `${paymentMethod} Virtual Account`}
            </span>
          </div>

          {/* QR vs VA */}
          <div className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center min-h-[80px]">
            {qrString ? (
              <div className="bg-white p-2 rounded-lg">
                <QRCode
                  value={qrString}
                  size={180}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox={`0 0 256 256`}
                />
              </div>
            ) : (
              <div className="w-full flex items-center justify-between">
                <span className="font-mono text-lg font-semibold tracking-wide text-foreground break-all">
                  {paymentCode || "-"}
                </span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onClick={handleCopy}
                  title="Salin Kode"
                >
                  <Copy className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="bg-secondary/30 px-6 py-3 border-t border-border flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Pembayaran akan terverifikasi otomatis. Halaman ini akan refresh otomatis setelah pembayaran berhasil.
        </p>
      </div>
    </div>
  );
};

export default PaymentInfoCard;