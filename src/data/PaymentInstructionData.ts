// src/data/paymentInstructionData.ts
import { PaymentInstructions } from "../types/payment";

// Mapping: Payment Method Code -> JSON Instructions
export const PAYMENT_INSTRUCTION_DATA: Record<string, PaymentInstructions> = {
  // --- BCA (Object Structure) ---
  BCA: {
    atm: [
      {
        title: "Find Nearest ATM",
        steps: {
          "Insert your BCA ATM card and PIN":
            "Insert your BCA ATM card and PIN",
          "Enter your ATM PIN": "Enter your ATM PIN",
        },
      },
      {
        title: "Payment Details",
        steps: {
          'Select Menu "Other Transaction"': 'Select Menu "Other Transaction"',
          'Select "Transfer"': 'Select "Transfer"',
          'Select "To BCA Virtual Account"': 'Select "To BCA Virtual Account"',
          'Enter Virtual Account Number <bold>{{fullPaymentCode}}</bold>. Press "Correct" to proceed':
            'Enter Virtual Account Number <bold>{{fullPaymentCode}}</bold>. Press "Correct" to proceed',
          'Verify Virtual Account details and then enter amount to be transferred and select "Correct" to confirm':
            'Verify Virtual Account details and then enter amount to be transferred and select "Correct" to confirm',
          "Confirm your transaction details displayed":
            "Confirm your transaction details displayed",
          'Select "Yes" if the details are correct or "No" if the details are not correct':
            'Select "Yes" if the details are correct or "No" if the details are not correct',
        },
      },
      {
        title: "Transaction Completed",
        steps: {
          'You have completed your transaction. Select "No" to end the transaction':
            'You have completed your transaction. Select "No" to end the transaction',
          "Once the payment transaction is completed, this invoice will be updated automatically. This may take up to 5 minute":
            "Once the payment transaction is completed, this invoice will be updated automatically. This may take up to 5 minute",
        },
      },
    ],
    ibanking: [
      {
        title: "Log In To Your Account",
        steps: {
          "Login to KlikBCA Individual (<anchor>{{iBankingSource}}</anchor>)":
            "Login to KlikBCA Individual (<anchor>{{iBankingSource}}</anchor>)",
          'Select "Transfer", then select "Transfer to BCA Virtual Account"':
            'Select "Transfer", then select "Transfer to BCA Virtual Account"',
        },
      },
      {
        title: "Payment Details",
        steps: {
          "Enter the Virtual Account Number <bold>{{fullPaymentCode}}</bold>":
            "Enter the Virtual Account Number <bold>{{fullPaymentCode}}</bold>",
          'Select "Continue" to proceed your payment':
            'Select "Continue" to proceed your payment',
          'Enter "RESPON KEYBCA APPLI 1" shown in your BCA Token, then click on the "Send" button':
            'Enter "RESPON KEYBCA APPLI 1" shown in your BCA Token, then click on the "Send" button',
          "Enter the authentication token code":
            "Enter the authentication token code",
        },
      },
      {
        title: "Transaction Completed",
        steps: {
          "Your transaction is successful": "Your transaction is successful",
          "Once the payment transaction is completed, this invoice will be updated automatically. This may take up to 5 minutes":
            "Once the payment transaction is completed, this invoice will be updated automatically. This may take up to 5 minutes",
        },
      },
    ],
    mbanking: [
      {
        title: "Log In To Your Account",
        steps: {
          "Open BCA Mobile App": "Open BCA Mobile App",
          'Select "m-BCA", then select "m-Transfer"':
            'Select "m-BCA", then select "m-Transfer"',
        },
      },
      {
        title: "Payment Details",
        steps: {
          'Select "m-BCA", then select "m-Transfer"':
            'Select "m-BCA", then select "m-Transfer"',
          'Enter your Virtual Account Number <bold>{{fullPaymentCode}}</bold>, then press "OK"':
            'Enter your Virtual Account Number <bold>{{fullPaymentCode}}</bold>, then press "OK"',
          'Click on "Send" button at the top right corner to proceed':
            'Click on "Send" button at the top right corner to proceed',
          'Click "OK" to proceed': 'Click "OK" to proceed',
          "Enter your PIN to authorize the transaction":
            "Enter your PIN to authorize the transaction",
        },
      },
      {
        title: "Transaction Completed",
        steps: {
          "Your transaction is successful": "Your transaction is successful",
          "Once the payment transaction is completed, this invoice will be updated automatically. This may take up to 5 minutes":
            "Once the payment transaction is completed, this invoice will be updated automatically. This may take up to 5 minutes",
        },
      },
    ],
  },

  // --- MANDIRI (Object Structure - Contains {{companyCode}}) ---
  MANDIRI: {
    "livin by mandiri": [
      {
        title: "Log In To Your Account",
        steps: {
          "Open Livin by Mandiri, then enter your PASSWORD or do face verification":
            "Open Livin by Mandiri, then enter your PASSWORD or do face verification",
          'Select "IDR Transfer"': 'Select "IDR Transfer"',
          'Select "Transfer to new recipient"':
            'Select "Transfer to new recipient"',
        },
      },
      {
        title: "Payment Details",
        steps: {
          "Enter your Virtual Account Number <bold>{{fullPaymentCode}}</bold>":
            "Enter your Virtual Account Number <bold>{{fullPaymentCode}}</bold>",
          'Confirm the VA detail and click "Continue"':
            'Confirm the VA detail and click "Continue"',
          "Input the amount to transfer (if not filled automatically)":
            "Input the amount to transfer (if not filled automatically)",
          'Review and confirm the transaction details and click "Continue"':
            'Review and confirm the transaction details and click "Continue"',
          "Complete the transaction by entering your MPIN":
            "Complete the transaction by entering your MPIN",
        },
      },
      {
        title: "Transaction Completed",
        steps: {
          "Upon successful payment, save the transaction receipt or screenshot the screen as a proof of payment":
            "Upon successful payment, save the transaction receipt or screenshot the screen as a proof of payment",
          "Once the payment transaction is completed, this invoice will be updated automatically. This may take up to 5 minutes":
            "Once the payment transaction is completed, this invoice will be updated automatically. This may take up to 5 minutes",
        },
      },
    ],
    atm: [
      {
        title: "Find Nearest ATM",
        steps: {
          'Insert your ATM card and select "English"':
            'Insert your ATM card and select "English"',
          'Enter PIN, then select "ENTER"': 'Enter PIN, then select "ENTER"',
          'Select "PAYMENT", then select "MULTI PAYMENT"':
            'Select "PAYMENT", then select "MULTI PAYMENT"',
        },
      },
      {
        title: "Payment Details",
        steps: {
          "Enter company code '{{companyCode}}' ({{companyCode}} XENDIT), then press \"CORRECT\"":
            "Enter company code '{{companyCode}}' ({{companyCode}} XENDIT), then press \"CORRECT\"",
          'Enter Virtual Account Number <bold>{{fullPaymentCode}}</bold>, then press "CORRECT"':
            'Enter Virtual Account Number <bold>{{fullPaymentCode}}</bold>, then press "CORRECT"',
          'Enter the amount to transfer, then press "CORRECT"':
            'Enter the amount to transfer, then press "CORRECT"',
          'Merchant details will be displayed, choose number 1 according to the amount billed and then press "YES"':
            'Merchant details will be displayed, choose number 1 according to the amount billed and then press "YES"',
          'Payment confirmation will be displayed. Select "YES", to proceed':
            'Payment confirmation will be displayed. Select "YES", to proceed',
        },
      },
      {
        title: "Transaction Completed",
        steps: {
          "Keep your receipt as proof of payment":
            "Keep your receipt as proof of payment",
          "Your transaction is successful": "Your transaction is successful",
          "Once the payment transaction is completed, this invoice will be updated automatically. This may take up to 5 minute":
            "Once the payment transaction is completed, this invoice will be updated automatically. This may take up to 5 minute",
        },
      },
    ],
  },

  // --- BRI (Object Structure) ---
  BRI: {
    atm: [
      {
        title: "Find Nearest ATM",
        steps: {
          "Insert the card, select the language and then enter your PIN":
            "Insert the card, select the language and then enter your PIN",
          'Select "Other Menu" and select "Payment"':
            'Select "Other Menu" and select "Payment"',
          'Select "Other Payment" and select "Briva"':
            'Select "Other Payment" and select "Briva"',
        },
      },
      {
        title: "Payment Details",
        steps: {
          "Enter virtual account number <bold>{{fullPaymentCode}}</bold> and the nominal that you want to pay":
            "Enter virtual account number <bold>{{fullPaymentCode}}</bold> and the nominal that you want to pay",
          'Check the transaction data and press "YES"':
            'Check the transaction data and press "YES"',
        },
      },
      {
        title: "Transaction Completed",
        steps: {
          "Once the payment transaction is completed, this invoice will be updated automatically. This may take up to 5 minute":
            "Once the payment transaction is completed, this invoice will be updated automatically. This may take up to 5 minute",
        },
      },
    ],
    mbanking: [
      {
        title: "Log In To Your Account",
        steps: {
          "Login to BRI Mobile Banking, enter your USER ID and PIN":
            "Login to BRI Mobile Banking, enter your USER ID and PIN",
          'Select "Payment" and select "Briva"':
            'Select "Payment" and select "Briva"',
        },
      },
      {
        title: "Payment Details",
        steps: {
          "Enter your Virtual Account Number <bold>{{fullPaymentCode}}</bold>, and the amount that you want to pay":
            "Enter your Virtual Account Number <bold>{{fullPaymentCode}}</bold>, and the amount that you want to pay",
          'Input your PIN and click "Send"': 'Input your PIN and click "Send"',
        },
      },
      {
        title: "Transaction Completed",
        steps: {
          "Once the payment transaction is completed, this invoice will be updated automatically. This may take up to 5 minutes":
            "Once the payment transaction is completed, this invoice will be updated automatically. This may take up to 5 minutes",
        },
      },
    ],
  },

  // --- ALFAMART (Array Structure - Direct List) ---
  ALFAMART: [
    {
      title: "Note",
      steps: {
        "You can make a payment to the Alfamart Group (Alfamart, Afamidi, Dan+Dan, Lawson).":
          "You can make a payment to the Alfamart Group (Alfamart, Afamidi, Dan+Dan, Lawson).",
        "Payments below IDR 2,5 Million are available via Alfamart, Afamidi, Dan+Dan, Lawson.":
          "Payments below IDR 2,5 Million are available via Alfamart, Afamidi, Dan+Dan, Lawson.",
        "Payments above IDR 2,5 Million are not available via Alfamidi.":
          "Payments above IDR 2,5 Million are not available via Alfamidi.",
      },
      is_unordered: true,
    },
    {
      title: "Find Nearest Branch",
      steps: {
        "Visit the nearest ALFAMART branch before the time on the payment code/barcode runs out":
          "Visit the nearest ALFAMART branch before the time on the payment code/barcode runs out",
        'Tell the cashier that you would like to make a payment to <bold>"{{merchantName}}" via Xendit</bold> or let them scan the barcode above':
          'Tell the cashier that you would like to make a payment to <bold>"{{merchantName}}" via Xendit</bold> or let them scan the barcode above',
      },
    },
    {
      title: "Payment Details",
      steps: {
        "Present the payment code/barcode to the cashier and confirm that the amount is correct":
          "Present the payment code/barcode to the cashier and confirm that the amount is correct",
        "Inform the cashier if you want to pay using a Cash only, or mixed combination of Cash and Debit/Prepaid Card or E-wallet.":
          "Inform the cashier if you want to pay using a Cash only, or mixed combination of Cash and Debit/Prepaid Card or E-wallet.",
        "Maximum amount allowed pay by Cash is IDR 2,5 Million, the rest should be combined using Debit/Prepaid Card or E-wallet.":
          "Maximum amount allowed pay by Cash is IDR 2,5 Million, the rest should be combined using Debit/Prepaid Card or E-wallet.",
        "Proceed to make a payment with the amount on your payment code/barcode":
          "Proceed to make a payment with the amount on your payment code/barcode",
      },
    },
    {
      title: "Transaction Completed",
      steps: {
        "Receive your proof of payment from the cashier":
          "Receive your proof of payment from the cashier",
        "Your transaction is successful": "Your transaction is successful",
      },
    },
  ],
};
