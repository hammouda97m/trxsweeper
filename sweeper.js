const TronWeb = require('tronweb');
require('dotenv').config();

// Configuration from environment variables
const MAIN_WALLET_ADDRESS = process.env.MAIN_WALLET_ADDRESS;
const SUB_WALLET_PRIVATE_KEY = process.env.SUB_WALLET_PRIVATE_KEY;
const TRON_NETWORK = process.env.TRON_NETWORK || 'mainnet';
const POLLING_INTERVAL = parseInt(process.env.POLLING_INTERVAL) || 5000;
const MIN_TRANSFER_AMOUNT = parseFloat(process.env.MIN_TRANSFER_AMOUNT) || 1;
const FEE_RESERVE = parseFloat(process.env.FEE_RESERVE) || 0.1;

// TronWeb initialization
const HttpProvider = TronWeb.providers.HttpProvider;
let fullNode, solidityNode, eventServer;

if (TRON_NETWORK === 'mainnet') {
  fullNode = 'https://api.trongrid.io';
  solidityNode = 'https://api.trongrid.io';
  eventServer = 'https://api.trongrid.io';
} else {
  // Shasta testnet
  fullNode = 'https://api.shasta.trongrid.io';
  solidityNode = 'https://api.shasta.trongrid.io';
  eventServer = 'https://api.shasta.trongrid.io';
}

const tronWeb = new TronWeb(
  new HttpProvider(fullNode),
  new HttpProvider(solidityNode),
  new HttpProvider(eventServer),
  SUB_WALLET_PRIVATE_KEY
);

// Validate configuration
function validateConfig() {
  if (!MAIN_WALLET_ADDRESS) {
    console.error('ERROR: MAIN_WALLET_ADDRESS is not set in .env file');
    process.exit(1);
  }
  
  if (!SUB_WALLET_PRIVATE_KEY) {
    console.error('ERROR: SUB_WALLET_PRIVATE_KEY is not set in .env file');
    process.exit(1);
  }
  
  console.log('Configuration validated successfully');
  console.log(`Network: ${TRON_NETWORK}`);
  console.log(`Main Wallet: ${MAIN_WALLET_ADDRESS}`);
  console.log(`Sub Wallet: ${tronWeb.defaultAddress.base58}`);
  console.log(`Polling Interval: ${POLLING_INTERVAL}ms`);
  console.log(`Minimum Transfer Amount: ${MIN_TRANSFER_AMOUNT} TRX`);
}

// Get SUB wallet balance in TRX
async function getSubWalletBalance() {
  try {
    const balance = await tronWeb.trx.getBalance(tronWeb.defaultAddress.base58);
    return tronWeb.fromSun(balance); // Convert from SUN to TRX
  } catch (error) {
    console.error('Error fetching balance:', error.message);
    return 0;
  }
}

// Transfer all available TRX from SUB wallet to MAIN wallet
async function sweepBalance() {
  try {
    const balanceInTrx = await getSubWalletBalance();
    
    if (balanceInTrx < MIN_TRANSFER_AMOUNT) {
      console.log(`Balance ${balanceInTrx} TRX is below minimum threshold ${MIN_TRANSFER_AMOUNT} TRX`);
      return;
    }
    
    console.log(`\n💰 Balance detected: ${balanceInTrx} TRX`);
    console.log('🚀 Initiating sweep...');
    
    // Reserve bandwidth/energy fee for transaction
    const amountToSend = balanceInTrx - FEE_RESERVE;
    
    if (amountToSend <= 0) {
      console.log('⚠️ Insufficient balance to cover transaction fee');
      return;
    }
    
    // Send transaction
    const transaction = await tronWeb.transactionBuilder.sendTrx(
      MAIN_WALLET_ADDRESS,
      tronWeb.toSun(amountToSend),
      tronWeb.defaultAddress.base58
    );
    
    const signedTx = await tronWeb.trx.sign(transaction);
    const result = await tronWeb.trx.sendRawTransaction(signedTx);
    
    if (result.result) {
      console.log('✅ Transfer successful!');
      console.log(`📤 Sent: ${amountToSend} TRX`);
      console.log(`📍 Transaction ID: ${result.txid}`);
      console.log(`🔗 View on TronScan: https://${TRON_NETWORK === 'mainnet' ? '' : 'shasta.'}tronscan.org/#/transaction/${result.txid}`);
    } else {
      console.error('❌ Transfer failed:', result);
    }
  } catch (error) {
    console.error('❌ Error during sweep:', error.message);
  }
}

// Main monitoring loop
let isMonitoring = false;

async function monitorWallet() {
  if (isMonitoring) {
    console.log('⏭️  Previous check still in progress, skipping...');
    return;
  }
  
  isMonitoring = true;
  
  try {
    console.log('\n🔍 Checking balance...');
    
    const balance = await getSubWalletBalance();
    console.log(`Current balance: ${balance} TRX`);
    
    if (balance >= MIN_TRANSFER_AMOUNT) {
      await sweepBalance();
    }
  } finally {
    isMonitoring = false;
  }
}

// Start the sweeper bot
async function start() {
  console.log('═══════════════════════════════════════');
  console.log('🤖 TRX SWEEPER BOT STARTED');
  console.log('═══════════════════════════════════════');
  
  validateConfig();
  
  console.log('\n👀 Monitoring SUB wallet for incoming TRX...');
  console.log('Press Ctrl+C to stop\n');
  
  // Initial check
  await monitorWallet();
  
  // Set up polling interval
  setInterval(async () => {
    await monitorWallet();
  }, POLLING_INTERVAL);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping TRX Sweeper Bot...');
  process.exit(0);
});

// Start the bot
start().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
