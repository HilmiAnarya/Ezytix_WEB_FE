/* eslint-disable @typescript-eslint/no-explicit-any */
// src/data/paymentStaticData.ts
import { Building2, Wallet, QrCode } from "lucide-react";

// Tipe data harus match dengan Backend InitiatePaymentRequest
export type PaymentType = "VIRTUAL_ACCOUNT" | "E_WALLET" | "QR_CODE";

export interface PaymentGroup {
  id: string;
  name: string;
  icon: any; // Lucide Icon Component
  methods: string[]; // List kode bank untuk badge
  channels: PaymentChannel[]; // Detail channel untuk diklik
  extra?: string;
}

export interface PaymentChannel {
  code: string; // "BCA", "MANDIRI", "OVO", "QRIS" (Sesuai Backend)
  type: PaymentType; // [NEW] "VIRTUAL_ACCOUNT", dll
  name: string;
  logo?: string;
}

export const PAYMENT_GROUPS: PaymentGroup[] = [
  {
    id: "bank_transfer",
    name: "Bank Transfer (Virtual Account)",
    icon: Building2,
    methods: ["BCA", "BRI", "BNI", "Mandiri", "Permata"],
    extra: "Auto Check",
    channels: [
      { code: "BCA", type: "VIRTUAL_ACCOUNT", name: "BCA Virtual Account", logo: "https://www.xendit.co/wp-content/uploads/2021/07/logo-bca.png" },
      { code: "BRI", type: "VIRTUAL_ACCOUNT", name: "BRI Virtual Account", logo: "https://cdn.document360.io/217abc43-8677-41fb-a81d-fceeb1fa0358/Images/Documentation/image(68).png?sv=2022-11-02&spr=https&st=2026-01-15T08%3A57%3A53Z&se=2026-01-15T09%3A16%3A53Z&sr=c&sp=r&sig=YAGRPCFa9HQBaxaz4LnxcvNpgbVQx%2BeM7MFodbFGVto%3D" },
      { code: "MANDIRI", type: "VIRTUAL_ACCOUNT", name: "Mandiri Bill", logo: "https://cdn.document360.io/217abc43-8677-41fb-a81d-fceeb1fa0358/Images/Documentation/Mandiri.png?sv=2022-11-02&spr=https&st=2026-01-15T08%3A58%3A39Z&se=2026-01-15T09%3A17%3A39Z&sr=c&sp=r&sig=b%2BlR0DGKahpLY%2BIU%2BdDKG0kMUwYcmdBzwVNzmOo93PI%3D" },
      { code: "BNI", type: "VIRTUAL_ACCOUNT", name: "BNI Virtual Account", logo: "https://cdn.document360.io/217abc43-8677-41fb-a81d-fceeb1fa0358/Images/Documentation/image(67).png?sv=2022-11-02&spr=https&st=2026-01-15T08%3A59%3A05Z&se=2026-01-15T09%3A28%3A05Z&sr=c&sp=r&sig=KQmvbh0NZxqoQXIhRSToemRfO4zXEtUM78VQsT08PuE%3D" },
      { code: "PERMATA", type: "VIRTUAL_ACCOUNT", name: "Permata Virtual Account", logo: "https://cdn.document360.io/217abc43-8677-41fb-a81d-fceeb1fa0358/Images/Documentation/blue-black_permata_bank_logotype_rgb.png?sv=2022-11-02&spr=https&st=2026-01-15T09%3A00%3A16Z&se=2026-01-15T09%3A19%3A16Z&sr=c&sp=r&sig=odKCsxsWZfFib%2FH8VqzCNvX8ccRfS9fKDtOyv8veWOk%3D" },
    ]
  },
  {
    id: "qris",
    name: "QRIS",
    icon: QrCode,
    methods: ["QRIS"],
    extra: "Instant",
    channels: [
      { code: "QRIS", type: "QR_CODE", name: "QRIS (Scan & Pay)", logo: "https://cdn.document360.io/217abc43-8677-41fb-a81d-fceeb1fa0358/Images/Documentation/qris-logo.svg?sv=2022-11-02&spr=https&st=2026-01-15T09%3A00%3A47Z&se=2026-01-15T09%3A11%3A47Z&sr=c&sp=r&sig=mkNaJBCXrWI1xTOZfxHO%2B0mNEFVExvxUKIiF0DseCuo%3D" }
    ]
  },
  {
    id: "ewallet",
    name: "E-Wallet",
    icon: Wallet,
    methods: ["OVO", "DANA", "ShopeePay"],
    extra: "Instant",
    channels: [
      { code: "OVO", type: "E_WALLET", name: "OVO", logo: "https://cdn.document360.io/217abc43-8677-41fb-a81d-fceeb1fa0358/Images/Documentation/image(49).png?sv=2022-11-02&spr=https&st=2026-01-15T09%3A01%3A11Z&se=2026-01-15T09%3A30%3A11Z&sr=c&sp=r&sig=%2FhYZwzukQsBq9Q2wdXUABU7l0BT5ZKuWJHbXg1AyRXQ%3D" },
      { code: "DANA", type: "E_WALLET", name: "DANA", logo: "https://cdn.document360.io/217abc43-8677-41fb-a81d-fceeb1fa0358/Images/Documentation/image(51).png?sv=2022-11-02&spr=https&st=2026-01-15T09%3A01%3A31Z&se=2026-01-15T09%3A14%3A31Z&sr=c&sp=r&sig=QO0SYGc6vacxboIPvpruFUF5zCGKVr00hF3eifEzSxM%3D" },
      { code: "SHOPEEPAY", type: "E_WALLET", name: "ShopeePay", logo: "https://cdn.document360.io/217abc43-8677-41fb-a81d-fceeb1fa0358/Images/Documentation/image(62).png?sv=2022-11-02&spr=https&st=2026-01-15T09%3A02%3A02Z&se=2026-01-15T09%3A31%3A02Z&sr=c&sp=r&sig=9LgMdL8PC4ioV6o8UzIptRgykOGMhkDTb4KCmzOfscI%3D" },
    ]
  }
];