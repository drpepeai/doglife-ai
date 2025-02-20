import React, { useState, useEffect } from "react";

export default function SPLTokenPrice() {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriceFromProxy = async () => {
      try {
        const response = await fetch("https://proxybryan-production.up.railway.app/api/bryan-price");

        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

        const data = await response.json();
        console.log("🔹 Full $BRYAN Token Data:", data);

        // Extract price in USDC
        if (data && data.price) {
          setPrice(data.price);
        } else {
          throw new Error("No price data found for $BRYAN.");
        }
      } catch (error) {
        console.error("❌ Error fetching price:", error);
        setPrice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceFromProxy();
    const interval = setInterval(fetchPriceFromProxy, 5000); // Auto-refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {loading ? <p>Loading price...</p> : <h2> $BRYAN Price: {price ? price : "N/A"} USDC </h2>}
    </div>
  );
}
