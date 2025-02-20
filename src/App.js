import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useSwipeable } from "react-swipeable";
import Hero from './components/Hero';
import TransferWidget from './components/TransferWidget';

// Solana wallet adapter components
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
];

function App() {
  return (
    <ConnectionProvider endpoint={QUICKNODE_RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <SwipeNavigator />
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// 🔹 Handles Swipe Navigation (Left/Right)
function SwipeNavigator() {
  const navigate = useNavigate();

  const handlers = useSwipeable({
    onSwipedLeft: () => navigate("/transfer-widget"), // Swipe left to go to TransferWidget
    onSwipedRight: () => navigate("/"), // Swipe right to go back to Home
    preventScrollOnSwipe: true, // Prevents scrolling while swiping
    trackMouse: true, // Enables swiping with mouse (for desktop support)
  });

  return (
    <div {...handlers} style={{ width: "100vw", height: "100vh" }}>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/transfer-widget" element={<TransferWidget />} />
      </Routes>
    </div>
  );
}

export default App;
