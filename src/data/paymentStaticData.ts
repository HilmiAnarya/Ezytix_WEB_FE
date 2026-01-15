/* eslint-disable @typescript-eslint/no-explicit-any */
// src/data/paymentStaticData.ts
import { Building2, CreditCard, Wallet, QrCode, Landmark } from "lucide-react";

export interface PaymentGroup {
  id: string;
  name: string;
  icon: any; // Lucide Icon Component
  methods: string[]; // List kode bank untuk ditampilkan di badge kecil
  channels: PaymentChannel[]; // Detail channel untuk diklik
  extra?: string;
}

export interface PaymentChannel {
  code: string; // Kode unik untuk dikirim ke API (misal: "BCA", "OVO")
  name: string;
  logo?: string; // Optional: URL Logo jika ada
}

export const PAYMENT_GROUPS: PaymentGroup[] = [
  {
    id: "bank_transfer",
    name: "Bank Transfer (Virtual Account)",
    icon: Building2,
    methods: ["BCA", "BRI", "BNI", "Mandiri", "Permata"],
    extra: "+9",
    channels: [
      { code: "BCA", name: "BCA Virtual Account" },
      { code: "BRI", name: "BRI Virtual Account" },
      { code: "MANDIRI", name: "Mandiri Bill" },
      { code: "BNI", name: "BNI Virtual Account" },
      { code: "PERMATA", name: "Permata Virtual Account" },
    ]
  },
  {
    id: "ewallet",
    name: "E-Wallet",
    icon: Wallet,
    methods: ["OVO", "DANA", "LinkAja", "ShopeePay"],
    extra: "+2",
    channels: [
      { code: "OVO", name: "OVO" },
      { code: "DANA", name: "DANA" },
      { code: "LINKAJA", name: "LinkAja" },
      { code: "SHOPEEPAY", name: "ShopeePay" },
    ]
  },
  {
    id: "qris",
    name: "QRIS",
    icon: QrCode,
    methods: ["QRIS"],
    channels: [
      { code: "QRIS", name: "QRIS (All Payment)" },
    ]
  },
  // Credit Card & Direct Debit bisa ditambahkan nanti jika Backend siap
];