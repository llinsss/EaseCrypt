EaseCrypt - Crypto Purchase Platform

EaseCrypt is a modern, user-friendly cryptocurrency purchase platform that allows users to buy various cryptocurrencies using fiat currency (Nigerian Naira) without requiring account registration.

 Features

- Zero Account Registration**: Purchase crypto with just wallet address and email
- Multiple Cryptocurrencies**: Support for ETH, BTC, USDC, and USDT
- Fiat Integration**: Seamless Naira-to-crypto conversion
- Bank Transfer**: Integrated with Providus Bank for easy payments
- Real-time Quotes**: Live exchange rates and transparent fee structure
- Dark/Light Theme**: Modern UI with theme support
- Transaction Tracking**: Complete flow from quote to completion

 Tech Stack

- Frontend: Next.js 15.2.4 with TypeScript
- Styling: Tailwind CSS with custom components
- State Management: Zustand with persistence
- UI Components: Radix UI + shadcn/ui
- Icons: Lucide React
- Theming: Next Themes

 Installation

1. Clone the repository:
bash
git clone <repository-url>
cd EaseCrypt


2. Install dependencies:
bash
npm install
 or
yarn install
or
pnpm install


3. Run the development server:
bash
npm run dev
or
yarn dev
or
pnpm dev


4. Open [http://localhost:3000](http://localhost:3000) in your browser.

 Usage Flow

1. Home Page (`/`)
- Select cryptocurrency (ETH, BTC, USDC, USDT)
- Enter amount in Nigerian Naira (₦)
- Provide wallet address for receiving tokens
- Enter email address for notifications
- Get quote for the transaction

 2. Quote Page (`/quote`)
- Review transaction summary
- See exchange rate and fees
- Confirm total cost including ₦50 network fee
- Proceed to payment

3. Payment Page (`/payment`)
- Get bank account details (Providus Bank)
- Transfer exact amount within time limit
- Copy account number functionality
- Mark payment as completed

4. Completion Page (`/complete`)
- Success/failure confirmation
- Transaction receipt with details
- Options to download PDF or share receipt
- Start new transaction

Configuration

The project uses environment variables for configuration. Create a `.env.local` file:

env
# Optional: Add any environment variables needed
NEXT_PUBLIC_APP_NAME=EaseCrypt
```

 Smart Contract Integration

contract_address: 0x02c2423604572ee284e9b7604c6951de138382d107f7c756cdbb4424f997cc7d
transaction_hash: 0x054a16c0a3dec55f925ed04a48ea5914a344281b51462f1f7fe8e26221aaba99

The project includes a Solidity smart contract (`UsageTracker.sol`) for tracking:
- Total transaction count
- Successful vs failed transactions
- User activity statistics
- Transaction completion status

 Project Structure

EaseCrypt/
├── app/                    # Next.js app directory
│   ├── complete/          # Transaction completion page
│   ├── payment/           # Payment processing page
│   ├── quote/             # Quote generation page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── crypto-ease-app.tsx # Main application component
├── lib/                   # Utilities and stores
│   ├── token-store.ts     # Zustand state management
│   └── utils.ts           # Helper functions
├── public/               # Static assets
└── contracts/            # Solidity smart contracts
    └── UsageTracker.sol  # Usage tracking contract


 Customization

 Adding New Cryptocurrencies
Edit `components/crypto-ease-app.tsx` to add new tokens to the `tokens` object.

 Modifying Exchange Rates
Update the `getTokenRate` function in `app/quote/page.tsx` with current rates.

Changing Bank Details
Modify the payment details in `app/payment/page.tsx`.

 Performance

- Built with Next.js 15 for optimal performance
- Client-side state management with Zustand
- Persistent storage for user preferences
- Optimized images and assets

Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

 License

This project is licensed under the MIT License - see the LICENSE file for details.