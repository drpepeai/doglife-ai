import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Hero from './components/Hero';
import TransferWidget from './components/TransferWidget';
import PageTransition_one from './components/PageTransition_one';
// Import Solana wallet adapter components
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

// Use QuickNode RPC instead of default clusterApiUrl
const QUICKNODE_RPC = "https://tame-evocative-hill.solana-mainnet.quiknode.pro/00fb7e2c6fe172daed8afd45630540790bfcc7eb";

// Configure wallet adapters
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  // You can add additional adapters here
];

function App() {
  return (
    <ConnectionProvider endpoint={QUICKNODE_RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <PageTransition_one>

              <Routes>
                <Route path="/" element={<Hero />} />
                <Route path="/transfer-widget" element={<TransferWidget />} />

              </Routes>

            </PageTransition_one>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
