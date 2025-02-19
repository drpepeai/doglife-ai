import React, { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";

export default function SPLTokenStats() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const walletAddress = "8WMtdNdc9ChinXkRDEL7QBxVjn2HhyzDYXKaxHuVMaDJ"; // Replace with your wallet
  const tokenMintAddress = "BrYANThKaAbjZZH5XWLrw26NzMbfUNmBwbZiMe4Fj5Mk"; // Example: USDC on Solana

  useEffect(() => {
    const connection = new Connection(
   
    );

    const fetchTokenBalance = async () => {
      try {
        const publicKey = new PublicKey(walletAddress);
        const tokenMint = new PublicKey(tokenMintAddress);

        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          mint: tokenMint,
        });

        if (tokenAccounts.value.length > 0) {
          const tokenBalance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
          setBalance(tokenBalance);
        } else {
          setBalance(0); // No balance found for this token
        }
      } catch (error) {
        console.error("Error fetching token balance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenBalance();
  }, []);

  return (
    <div>
      <h2>SPL Token Balance</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>
          The balance of the token ({tokenMintAddress}) in {walletAddress} is {balance}
        </p>
      )}
    </div>
  );
}
