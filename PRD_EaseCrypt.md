# Product Requirements Document (PRD) for EaseCrypt

## 1. Overview

EaseCrypt is a modern, user-friendly cryptocurrency purchase platform designed to enable users in Nigeria to buy various cryptocurrencies using Nigerian Naira without requiring account registration. The platform supports multiple cryptocurrencies and integrates with local banking for seamless fiat-to-crypto transactions.

## 2. Features

- **Zero Account Registration:** Users can purchase crypto with just a wallet address and email.
- **Multiple Cryptocurrencies Supported:** Ethereum (ETH), Bitcoin (BTC), USD Coin (USDC), and Tether (USDT).
- **Fiat Integration:** Seamless conversion from Nigerian Naira (₦) to cryptocurrencies.
- **Bank Transfer Payments:** Integrated with Providus Bank for easy payment processing.
- **Real-time Quotes:** Live exchange rates with transparent fee structure including network fees.
- **Dark/Light Theme:** Modern UI with theme toggle support.
- **Transaction Tracking:** Full transaction flow from quote generation to completion with receipt download and sharing options.

## 3. Technology Stack

- **Frontend:** Next.js 15.2.4 with TypeScript
- **Styling:** Tailwind CSS with custom UI components (Radix UI + shadcn/ui)
- **State Management:** Zustand with persistence
- **Icons:** Lucide React
- **Theming:** Next Themes
- **Smart Contract:** Solidity (Ethereum blockchain)

## 4. User Flow

1. **Home Page:** Select cryptocurrency, enter amount in Naira, provide wallet address and email, get a quote.
2. **Quote Page:** Review transaction summary, exchange rate, fees, and confirm total cost.
3. **Payment Page:** Receive bank account details, make payment via bank transfer, mark payment as completed.
4. **Completion Page:** View success/failure confirmation, transaction receipt, download/share receipt, start new transaction.

## 5. Base Solidity Smart Contract

The project includes a Solidity smart contract to track usage and transaction statistics on the blockchain. This contract is designed to:

- Track total transaction count.
- Record successful and failed transactions.
- Maintain user activity statistics.
- Store transaction completion status.

### Example Base Solidity Smart Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UsageTracker {
    uint256 public totalTransactions;
    uint256 public successfulTransactions;
    uint256 public failedTransactions;

    mapping(address => uint256) public userTransactionCount;
    mapping(address => uint256) public userSuccessfulTransactions;

    event TransactionRecorded(address indexed user, bool success);

    function recordTransaction(address user, bool success) external {
        totalTransactions += 1;
        userTransactionCount[user] += 1;

        if (success) {
            successfulTransactions += 1;
            userSuccessfulTransactions[user] += 1;
        } else {
            failedTransactions += 1;
        }

        emit TransactionRecorded(user, success);
    }

    function getUserStats(address user) external view returns (uint256 total, uint256 successful) {
        return (userTransactionCount[user], userSuccessfulTransactions[user]);
    }
}
```

This contract can be extended to include more detailed tracking and integration with the EaseCrypt platform backend.

## 6. Future Enhancements

- Integration with multiple Nigerian banks
- Mobile app development
- Additional cryptocurrency support
- Advanced analytics and reporting
- Multi-language support
- Enhanced security features
- Automated payment verification
- API integration for third-party services

## 7. Success Metrics

- User acquisition rate
- Transaction completion rate
- Customer satisfaction scores
- Platform uptime and reliability
- Transaction volume growth
- User retention rate
