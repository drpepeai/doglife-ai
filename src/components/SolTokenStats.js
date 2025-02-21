import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";

import { priceAtom } from "../jotai"; // Import global atom

import { Connection, PublicKey } from "@solana/web3.js";

import styles from "./transferWidget.module.css";

export default function SPLTokenStats() {

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useAtom(priceAtom); // Use global state
  const [loadingPrice, setLoadingPrice] = useState(true);

  const walletAddress = "1VohKPJc5b1ZMfpzs6RM9hh4S5f55ybWHxw3L8uZ36F";
  const tokenMintAddress = "BrYANThKaAbjZZH5XWLrw26NzMbfUNmBwbZiMe4Fj5Mk";

  useEffect(() => {
    // 🔹 Solana Connection
    const connection = new Connection(
      "https://tame-evocative-hill.solana-mainnet.quiknode.pro/00fb7e2c6fe172daed8afd45630540790bfcc7eb",
      "confirmed"
    );

    const fetchTokenBalance = async () => {
      try {
        const publicKey = new PublicKey(walletAddress);
        const tokenMint = new PublicKey(tokenMintAddress);

        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          mint: tokenMint,
        });

        if (tokenAccounts.value.length > 0) {
          const tokenData = tokenAccounts.value[0].account.data.parsed.info;
          const tokenBalance = tokenData.tokenAmount.uiAmount;

          setBalance(tokenBalance);
          console.log("🔹 Wallet Balance Data:", tokenData);
        } else {
          setBalance(0);
        }
      } catch (error) {
        console.error("❌ Error fetching token data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenBalance();
  }, []);

  useEffect(() => {
    // 🔹 Fetch $BRYAN price from Railway API
    const fetchPriceFromProxy = async () => {
      try {
        const response = await fetch("https://proxybryan-production.up.railway.app/api/bryan-price");

        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

        const data = await response.json();
        console.log("🔹 $BRYAN Price Data:", data);

        if (data && data.price) {
          setPrice(data.price);
        } else {
          throw new Error("No price data found for $BRYAN.");
        }
      } catch (error) {
        console.error("❌ Error fetching $BRYAN price:", error);
        setPrice(null);
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchPriceFromProxy();
    const interval = setInterval(fetchPriceFromProxy, 5000); // Auto-refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>


      {/* 🔹 Display Balance */}
      {loading ? (
        <p>Loading balance...</p>
      ) : (
        <>
          <div className={styles}>Total Raised: {balance.toLocaleString('en-US')}</div>
        </>
      )}

 
      {/* 
      
      
      {loadingPrice ? (
        <p>Loading price...</p>
      ) : (
        <div className={styles.price}>
          Current Price: {price ? price : "N/A"} USDC
        </div>
      )}
      
       */}
     

      {/* 🔹 Display Total Raised in $BRYAN */}
      {!loading && !loadingPrice && (
        <div className={styles}>
   Total Raised in USDC: {Number(balance * price).toFixed(2)}
        </div>
      )}
          
    </div>
  );
}


