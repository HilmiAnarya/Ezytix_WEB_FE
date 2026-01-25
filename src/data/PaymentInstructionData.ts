// src/data/PaymentInstructionData.ts
import { PaymentInstructions } from "../types/payment";

// Mapping: Payment Method Code -> JSON Instructions
export const PAYMENT_INSTRUCTION_DATA: Record<string, PaymentInstructions> = {
  // --- BCA (Standard Virtual Account) ---
  BCA: {
    atm: [
      {
        title: "ATM BCA",
        steps: {
          "Masukkan Kartu ATM BCA & PIN": "Masukkan Kartu ATM BCA & PIN",
          "Pilih menu Transaksi Lainnya > Transfer > ke Rekening BCA Virtual Account": 
            "Pilih menu Transaksi Lainnya > Transfer > ke Rekening BCA Virtual Account",
          "Masukkan nomor Virtual Account <bold>{{fullPaymentCode}}</bold>": 
            "Masukkan nomor Virtual Account <bold>{{fullPaymentCode}}</bold>",
          "Di halaman konfirmasi, pastikan detil pembayaran sudah sesuai seperti No VA, Nama, Perus/Produk": 
            "Di halaman konfirmasi, pastikan detil pembayaran sudah sesuai seperti No VA, Nama, Perus/Produk",
          "Masukkan Jumlah Transfer sesuai dengan Total Tagihan": 
            "Masukkan Jumlah Transfer sesuai dengan Total Tagihan",
          "Ikuti instruksi untuk menyelesaikan transaksi": "Ikuti instruksi untuk menyelesaikan transaksi",
        },
      },
    ],
    mbanking: [
      {
        title: "m-BCA (BCA Mobile)",
        steps: {
          "Lakukan log in pada aplikasi BCA Mobile": "Lakukan log in pada aplikasi BCA Mobile",
          "Pilih menu m-BCA, kemudian masukkan kode akses m-BCA": "Pilih menu m-BCA, kemudian masukkan kode akses m-BCA",
          "Pilih m-Transfer > BCA Virtual Account": "Pilih m-Transfer > BCA Virtual Account",
          "Pilih dari Daftar Transfer, atau masukkan nomor Virtual Account <bold>{{fullPaymentCode}}</bold>": 
            "Pilih dari Daftar Transfer, atau masukkan nomor Virtual Account <bold>{{fullPaymentCode}}</bold>",
          "Masukkan jumlah yang ingin dibayarkan": "Masukkan jumlah yang ingin dibayarkan",
          "Masukkan pin m-BCA": "Masukkan pin m-BCA",
          "Pembayaran selesai. Simpan notifikasi yang muncul sebagai bukti pembayaran": 
            "Pembayaran selesai. Simpan notifikasi yang muncul sebagai bukti pembayaran",
        },
      },
    ],
    ibanking: [
      {
        title: "KlikBCA Individual",
        steps: {
          "Login pada aplikasi KlikBCA Individual": "Login pada aplikasi KlikBCA Individual",
          "Masukkan User ID dan PIN": "Masukkan User ID dan PIN",
          "Pilih Transfer Dana > Transfer ke BCA Virtual Account": "Pilih Transfer Dana > Transfer ke BCA Virtual Account",
          "Masukkan nomor Virtual Account <bold>{{fullPaymentCode}}</bold>": 
            "Masukkan nomor Virtual Account <bold>{{fullPaymentCode}}</bold>",
          "Masukkan jumlah yang ingin dibayarkan": "Masukkan jumlah yang ingin dibayarkan",
          "Validasi pembayaran": "Validasi pembayaran",
          "Cetak nomor referensi transaksi sebagai bukti pembayaran": "Cetak nomor referensi transaksi sebagai bukti pembayaran",
        },
      },
    ],
  },

  // --- MANDIRI (Bill Payment - BEDA DENGAN VA BIASA) ---
  MANDIRI: {
    "livin by mandiri": [
      {
        title: "Livin' by Mandiri (Aplikasi Kuning)",
        steps: {
          "Login ke aplikasi Livin' by Mandiri": "Login ke aplikasi Livin' by Mandiri",
          "Pilih menu Bayar": "Pilih menu Bayar",
          "Cari penyedia jasa <bold>Midtrans</bold> atau masukkan kode perusahaan <bold>{{companyCode}}</bold>": 
            "Cari penyedia jasa <bold>Midtrans</bold> atau masukkan kode perusahaan <bold>{{companyCode}}</bold>",
          "Masukkan <bold>Kode Bayar (Bill Key)</bold> Anda: <bold>{{fullPaymentCode}}</bold>": 
            "Masukkan <bold>Kode Bayar (Bill Key)</bold> Anda: <bold>{{fullPaymentCode}}</bold>",
          "Konfirmasi rincian pembayaran Anda, lalu tekan Lanjut": "Konfirmasi rincian pembayaran Anda, lalu tekan Lanjut",
          "Masukkan MPIN untuk menyelesaikan transaksi": "Masukkan MPIN untuk menyelesaikan transaksi",
        },
      },
    ],
    atm: [
      {
        title: "ATM Mandiri",
        steps: {
          "Masukkan kartu ATM dan PIN": "Masukkan kartu ATM dan PIN",
          "Pilih menu Bayar/Beli": "Pilih menu Bayar/Beli",
          "Pilih menu Lainnya > Lainnya > Multi Payment": "Pilih menu Lainnya > Lainnya > Multi Payment",
          "Masukkan Kode Perusahaan / Biller Code <bold>{{companyCode}}</bold> (Midtrans)": 
            "Masukkan Kode Perusahaan / Biller Code <bold>{{companyCode}}</bold> (Midtrans)",
          "Masukkan <bold>Kode Bayar (Bill Key)</bold>: <bold>{{fullPaymentCode}}</bold>": 
            "Masukkan <bold>Kode Bayar (Bill Key)</bold>: <bold>{{fullPaymentCode}}</bold>",
          "Konfirmasi rincian pembayaran, lalu tekan Ya": "Konfirmasi rincian pembayaran, lalu tekan Ya",
        },
      },
    ],
  },

  // --- BNI ---
  BNI: {
    atm: [
      {
        title: "ATM BNI",
        steps: {
          "Masukkan Kartu ATM BNI & PIN": "Masukkan Kartu ATM BNI & PIN",
          "Pilih menu Lainnya > Transfer > ke Rekening BNI Virtual Account": 
            "Pilih menu Lainnya > Transfer > ke Rekening BNI Virtual Account",
          "Masukkan nomor Virtual Account <bold>{{fullPaymentCode}}</bold>": 
            "Masukkan nomor Virtual Account <bold>{{fullPaymentCode}}</bold>",
          "Periksa ulang data transaksi Anda, lalu tekan Ya": "Periksa ulang data transaksi Anda, lalu tekan Ya",
        },
      },
    ],
    mbanking: [
      {
        title: "BNI Mobile Banking",
        steps: {
          "Login ke BNI Mobile Banking": "Login ke BNI Mobile Banking",
          "Pilih menu Transfer > Virtual Account Billing": "Pilih menu Transfer > Virtual Account Billing",
          "Pilih Input Baru, lalu masukkan nomor Virtual Account <bold>{{fullPaymentCode}}</bold>": 
            "Pilih Input Baru, lalu masukkan nomor Virtual Account <bold>{{fullPaymentCode}}</bold>",
          "Konfirmasi transaksi dan masukkan Password Transaksi": "Konfirmasi transaksi dan masukkan Password Transaksi",
        },
      },
    ],
  },

  // --- BRI ---
  BRI: {
    atm: [
      {
        title: "ATM BRI",
        steps: {
          "Pilih menu Transaksi Lain > Pembayaran > Lainnya > BRIVA": 
            "Pilih menu Transaksi Lain > Pembayaran > Lainnya > BRIVA",
          "Masukkan Nomor BRIVA <bold>{{fullPaymentCode}}</bold>": 
            "Masukkan Nomor BRIVA <bold>{{fullPaymentCode}}</bold>",
          "Pilih Ya untuk memproses pembayaran": "Pilih Ya untuk memproses pembayaran",
        },
      },
    ],
    mbanking: [
      {
        title: "BRImo",
        steps: {
          "Login ke aplikasi BRImo": "Login ke aplikasi BRImo",
          "Pilih menu Pembayaran > BRIVA": "Pilih menu Pembayaran > BRIVA",
          "Masukkan nomor BRIVA <bold>{{fullPaymentCode}}</bold>": 
            "Masukkan nomor BRIVA <bold>{{fullPaymentCode}}</bold>",
          "Masukkan PIN BRImo untuk menyelesaikan transaksi": "Masukkan PIN BRImo untuk menyelesaikan transaksi",
        },
      },
    ],
  },

  // --- PERMATA ---
  PERMATA: {
    atm: [
      {
        title: "ATM Permata / ALTO / ATM Bersama / Prima",
        steps: {
          "Pilih menu Transaksi Lainnya > Pembayaran > Pembayaran Lainnya > Virtual Account": 
            "Pilih menu Transaksi Lainnya > Pembayaran > Pembayaran Lainnya > Virtual Account",
          "Masukkan nomor Virtual Account <bold>{{fullPaymentCode}}</bold>": 
            "Masukkan nomor Virtual Account <bold>{{fullPaymentCode}}</bold>",
          "Di halaman konfirmasi, pastikan detil pembayaran sudah sesuai": 
            "Di halaman konfirmasi, pastikan detil pembayaran sudah sesuai",
        },
      },
    ],
  },

  // --- ALFAMART ---
  ALFAMART: [
    {
      title: "Alfamart / Alfamidi / Dan+Dan",
      steps: {
        "Kunjungi gerai Alfamart, Alfamidi, atau Dan+Dan terdekat": 
          "Kunjungi gerai Alfamart, Alfamidi, atau Dan+Dan terdekat",
        "Beritahu kasir bahwa Anda ingin melakukan pembayaran <bold>Midtrans</bold>": 
          "Beritahu kasir bahwa Anda ingin melakukan pembayaran <bold>Midtrans</bold>",
        "Tunjukkan Kode Pembayaran ke kasir: <bold>{{fullPaymentCode}}</bold>": 
          "Tunjukkan Kode Pembayaran ke kasir: <bold>{{fullPaymentCode}}</bold>",
        "Lakukan pembayaran sesuai nominal yang disebutkan": "Lakukan pembayaran sesuai nominal yang disebutkan",
        "Simpan struk sebagai bukti pembayaran yang sah": "Simpan struk sebagai bukti pembayaran yang sah",
      },
    },
  ],
};