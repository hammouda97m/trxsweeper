# TRX Sweeper Bot 🤖

A bot that automatically monitors a SUB wallet and immediately transfers all incoming TRX to a MAIN wallet.

## Features

- ✅ Automatic monitoring of SUB wallet balance
- ✅ Immediate transfer of TRX to MAIN wallet when balance is detected
- ✅ Configurable polling interval
- ✅ Minimum transfer threshold
- ✅ Support for both Mainnet and Testnet (Shasta)
- ✅ Transaction fee handling
- ✅ Detailed logging and transaction tracking

## How It Works

1. The bot continuously monitors the SUB wallet for TRX balance
2. When TRX is detected (above minimum threshold), it automatically triggers a transfer
3. All available TRX (minus transaction fee) is sent to the MAIN wallet
4. Transaction details are logged with TronScan link for verification

## Prerequisites

- Node.js (v14 or higher)
- npm
- A MAIN wallet address (to receive TRX)
- A SUB wallet private key (the wallet to monitor)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/hammouda97m/trxsweeper.git
cd trxsweeper
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Edit `.env` and configure your wallets:
```
MAIN_WALLET_ADDRESS=TYourMainWalletAddressHere
SUB_WALLET_PRIVATE_KEY=your_sub_wallet_private_key_here
TRON_NETWORK=mainnet
POLLING_INTERVAL=5000
MIN_TRANSFER_AMOUNT=1
FEE_RESERVE=0.1
```

## Configuration

Edit the `.env` file with the following parameters:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `MAIN_WALLET_ADDRESS` | The destination wallet address (receives TRX) | Required |
| `SUB_WALLET_PRIVATE_KEY` | Private key of the wallet to monitor | Required |
| `TRON_NETWORK` | Network to use: `mainnet` or `shasta` (testnet) | `mainnet` |
| `POLLING_INTERVAL` | How often to check balance (in milliseconds) | `5000` |
| `MIN_TRANSFER_AMOUNT` | Minimum TRX balance to trigger transfer | `1` |
| `FEE_RESERVE` | TRX amount reserved for transaction fees | `0.1` |

## Usage

Start the sweeper bot:

```bash
npm start
```

The bot will:
- Display configuration details
- Start monitoring the SUB wallet
- Log balance checks every polling interval
- Automatically transfer TRX when detected
- Display transaction details and TronScan link

To stop the bot, press `Ctrl+C`.

## Security Considerations

⚠️ **IMPORTANT SECURITY NOTES:**

1. **Never share your private key** - Keep your `.env` file secure and private
2. **Use .gitignore** - The `.env` file is excluded from git to prevent accidental commits
3. **Test first** - Use the Shasta testnet to test before using mainnet
4. **Minimum balance** - The bot reserves ~0.1 TRX for transaction fees
5. **Monitor logs** - Keep track of transactions for security

## Example Output

```
═══════════════════════════════════════
🤖 TRX SWEEPER BOT STARTED
═══════════════════════════════════════
Configuration validated successfully
Network: mainnet
Main Wallet: TMainWalletAddress...
Sub Wallet: TSubWalletAddress...
Polling Interval: 5000ms
Minimum Transfer Amount: 1 TRX

👀 Monitoring SUB wallet for incoming TRX...
Press Ctrl+C to stop

🔍 Checking balance...
Current balance: 10.5 TRX

💰 Balance detected: 10.5 TRX
🚀 Initiating sweep...
✅ Transfer successful!
📤 Sent: 10.4 TRX
📍 Transaction ID: abc123...
🔗 View on TronScan: https://tronscan.org/#/transaction/abc123...
```

## Testing

To test on the Shasta testnet:

1. Get testnet TRX from the [Shasta Faucet](https://www.trongrid.io/shasta/)
2. Set `TRON_NETWORK=shasta` in your `.env` file
3. Run the bot and send test TRX to your SUB wallet
4. Verify transfers on [Shasta TronScan](https://shasta.tronscan.org/)

## Troubleshooting

**Bot doesn't start:**
- Check that all required environment variables are set in `.env`
- Verify Node.js is installed: `node --version`

**Transfer fails:**
- Ensure SUB wallet has enough balance to cover transaction fees
- Verify network connectivity
- Check that addresses are valid Tron addresses

**Balance not detected:**
- Confirm TRX was sent to the SUB wallet address
- Check the polling interval - it may take a few seconds to detect
- Verify you're on the correct network (mainnet vs testnet)

## License

ISC

## Disclaimer

This software is provided as-is. Use at your own risk. Always test with small amounts first and ensure you understand the implications of automated wallet transactions.
