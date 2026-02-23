/* eslint-disable @typescript-eslint/no-explicit-any */
import { Building2, Wallet, QrCode } from "lucide-react";
import { PaymentType } from "../types/payment"; // Pastikan import ini ada

export interface PaymentChannel {
  code: string; 
  type: PaymentType;
  name: string;
  logo?: string;
}

export interface PaymentGroup {
  id: string;
  name: string;
  icon: any; 
  methods: string[];
  channels: PaymentChannel[]; 
  extra?: string;
}

export const PAYMENT_GROUPS: PaymentGroup[] = [
  {
    id: "bank_transfer",
    name: "Transfer Virtual Account",
    icon: Building2,
    methods: ["BCA", "BRI", "BNI", "Mandiri", "Permata"],
    extra: "Auto Check",
    channels: [
      { 
        code: "bca", 
        type: "bank_transfer",
        name: "BCA Virtual Account", 
        logo: "https://cdn.worldvectorlogo.com/logos/bca-bank-central-asia.svg" 
      },
      { 
        code: "bri", 
        type: "bank_transfer", 
        name: "BRI Virtual Account", 
        logo: "https://upload.wikimedia.org/wikipedia/commons/6/68/BANK_BRI_logo.svg" 
      },
      { 
        code: "bni", 
        type: "bank_transfer", 
        name: "BNI Virtual Account", 
        logo: "https://upload.wikimedia.org/wikipedia/id/5/55/BNI_logo.svg" 
      },
      { 
        code: "permata", 
        type: "bank_transfer", 
        name: "Permata Virtual Account", 
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Permata_Bank_logo_%282006%29.svg" 
      },
      { 
        code: "mandiri", 
        type: "echannel", 
        name: "Mandiri Bill Payment", 
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg" 
      }
    ]
  },
  {
    id: "qris",
    name: "QRIS",
    icon: QrCode,
    methods: ["QRIS"],
    extra: "Instant",
    channels: [
      { 
        code: "gopay",
        type: "qris", 
        name: "QRIS (Scan & Pay)", 
        logo: "https://upload.wikimedia.org/wikipedia/commons/d/d4/QRIS_logo.svg" 
      }
    ]
  },
  {
    id: "ewallet",
    name: "E-Wallet",
    icon: Wallet,
    methods: ["GoPay"],
    extra: "Instant",
    channels: [
      { 
        code: "gopay", 
        type: "gopay", 
        name: "GoPay", 
        logo: "https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg" 
      }
    ]
  }
];
