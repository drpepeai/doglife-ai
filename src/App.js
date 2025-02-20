import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import Hero from './components/Hero';
import TransferWidget from './components/TransferWidget';

// Solana wallet adapter components
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

const QUICKNODE_RPC = "https://tame-evocative-hill.solana-mainnet.quiknode.pro/00fb7e2c6fe172daed8afd45630540790bfcc7eb";

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

// 🔹 Handles Swipe Navigation & 3D Cube Animation
function SwipeNavigator() {
  const navigate = useNavigate();
  const location = useLocation();

  const handlers = useSwipeable({
    onSwipedLeft: () => navigate("/transfer-widget"), // Swipe left to go to TransferWidget
    onSwipedRight: () => navigate("/"), // Swipe right to go back to Hero
    preventScrollOnSwipe: true, // Prevents scrolling while swiping
    trackMouse: true, // Enables swiping with mouse
  });

  return (
    <div {...handlers} className="cube-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          className="cube-page"
          initial={{ rotateY: location.pathname === "/transfer-widget" ? 45 : 0 }}
          animate={{ rotateY: 0 }}
          exit={{ rotateY: location.pathname === "/transfer-widget" ? 45 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/transfer-widget" element={<TransferWidget />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
