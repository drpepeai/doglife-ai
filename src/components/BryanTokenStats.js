import React, { useEffect, useState } from "react";

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
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md w-96">
      <h2 className="text-xl font-bold mb-2">$BRYAN Token Stats</h2>
      {loading ? (
        <p>Loading data...</p>
      ) : tokenData ? (
        <div>
          <p><strong>Price:</strong> ${tokenData.price?.toFixed(4)}</p>
          <p><strong>Market Cap:</strong> ${tokenData.market_cap?.toLocaleString()}</p>
          <p><strong>Liquidity:</strong> ${tokenData.liquidity?.toLocaleString()}</p>
          <p><strong>24h Volume:</strong> ${tokenData.volume_24h?.toLocaleString()}</p>
          <p><strong>Supply:</strong> {tokenData.supply?.toLocaleString()} $BRYAN</p>
        </div>
      ) : (
        <p>Error fetching data.</p>
      )}
    </div>
  );
};

export default BryanTokenStats
