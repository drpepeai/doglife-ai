import React, { useEffect, useState } from "react";
import styles from './bryanTokenStats.module.css';


const QUICKNODE_URL = "https://tame-evocative-hill.solana-mainnet.quiknode.pro/00fb7e2c6fe172daed8afd45630540790bfcc7eb";
const BRYAN_TOKEN_MINT = "BrYANThKaAbjZZH5XWLrw26NzMbfUNmBwbZiMe4Fj5Mk"; // $BRYAN Token Mint Address

const BryanTokenStats = () => {
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        const response = await fetch(`${QUICKNODE_URL}/addon/912/networks/solana/tokens/${BRYAN_TOKEN_MINT}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Token Data:", data);

        setTokenData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching $BRYAN data:", error);
        setLoading(false);
      }
    };

    fetchTokenInfo();
    const interval = setInterval(fetchTokenInfo, 30000); // Auto-refresh every 30s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.graphcontainer}>
      <div className={styles.title}>DogLife.ai wallet stats</div>
      {loading ? (
        <p>Loading data...</p>
      ) : tokenData ? (
        <div>
          <div><strong>CA:</strong> 1VohKPJc5b1ZMfpzs6RM9hh4S5f55ybWHxw3L8uZ36F</div>
          <div><strong>Total raised in $bryan:</strong> </div>
          <div><strong>Total raised in USDC:</strong></div>

        </div>
      ) : (
        <p>Error fetching data.</p>
      )}
    </div>
  );
};

export default BryanTokenStats
