import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom"; 
import l_bottom_left from "../assets/l_bottom_left.svg";
import l_bottom_right from "../assets/l_bottom_right.svg";

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import {
    getAssociatedTokenAddress,
    createTransferInstruction,
    createAssociatedTokenAccountInstruction,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import styles from './transferWidget.module.css';
import './walletMultiButton.css';
import '@solana/wallet-adapter-react-ui/styles.css';

// Token Constants
const TOKEN_MINT_ADDRESS = 'BrYANThKaAbjZZH5XWLrw26NzMbfUNmBwbZiMe4Fj5Mk';
const TOKEN_DECIMALS = 9; 

const TransferWidget = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState(null);
    const gridRef = useRef(null);

    useEffect(() => {
        if (!publicKey) {
            setBalance(null);
            return;
        }
        const fetchBalance = async () => {
            try {
                const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);
                const tokenAccountAddress = await getAssociatedTokenAddress(mintPublicKey, publicKey);
                const balanceInfo = await connection.getTokenAccountBalance(tokenAccountAddress);
                setBalance(balanceInfo.value.uiAmount || 0);
            } catch (error) {
                console.error('Failed to fetch token balance:', error);
                setBalance(0);
            }
        };
        fetchBalance();
    }, [publicKey, connection]);

    useEffect(() => {
        if (!gridRef.current) return;

        const gridItems = gridRef.current.querySelectorAll(".grid-item");

        // Grid animation
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            gridItems.forEach((item) => {
                const rect = item.getBoundingClientRect();
                const distanceX = clientX - (rect.left + rect.width / 2);
                const distanceY = clientY - (rect.top + rect.height / 2);
                const distance = Math.hypot(distanceX, distanceY);

                const maxDistance = 200;
                const intensity = 1 - Math.min(distance / maxDistance, 1);

                const translateX = -intensity * (distanceX / distance) * 20;
                const translateY = -intensity * (distanceY / distance) * 20;

                item.style.transform = `translate(${translateX}px, ${translateY}px)`;
            });
        };

        const handleMouseLeave = () => {
            gridItems.forEach((item) => {
                item.style.transform = "translate(0, 0)";
            });
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    const handleTransfer = async () => {
        if (!publicKey) {
            alert('Please connect your wallet');
            return;
        }

        try {
            const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);
            const recipientPubKey = new PublicKey(recipient);
            const senderTokenAddress = await getAssociatedTokenAddress(mintPublicKey, publicKey);
            const recipientTokenAddress = await getAssociatedTokenAddress(mintPublicKey, recipientPubKey);
            const transaction = new Transaction();

            const accountInfo = await connection.getAccountInfo(recipientTokenAddress);
            if (!accountInfo) {
                transaction.add(
                    createAssociatedTokenAccountInstruction(
                        publicKey,
                        recipientTokenAddress,
                        recipientPubKey,
                        mintPublicKey
                    )
                );
            }

            const tokenAmount = Math.floor(parseFloat(amount) * Math.pow(10, TOKEN_DECIMALS));
            transaction.add(
                createTransferInstruction(
                    senderTokenAddress,
                    recipientTokenAddress,
                    publicKey,
                    tokenAmount,
                    [],
                    TOKEN_PROGRAM_ID
                )
            );

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');

            alert(`Transfer successful! Signature: ${signature}`);
        } catch (error) {
            console.error('Transfer failed:', error);
            alert('Transfer failed: ' + (error?.message || 'Unknown error'));
        }
    };

    const handleAmountChange = (e) => {
        const { value } = e.target;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const handlePercentageClick = (percent) => {
        if (balance !== null) {
            setAmount((balance * percent).toString());
        }
    };

    return (
        <>
            <div>
                {/* Grid Background */}
                <div ref={gridRef} className="elastic-grid">
                    {[...Array(64)].map((_, index) => (
                        <div key={index} className="grid-item" />
                    ))}
                </div>

                {/* 4 Corner Words */}
                <div className="corner-text bottom-left">
                    <img src={l_bottom_left} alt="l" height={15} />
                </div>
                <div className="corner-text bottom-right">
                    <img src={l_bottom_right} alt="l" height={15} />
                </div>
                <div className="corner-text top-left">
                    <Link to="/" className="burn-link">HOME</Link>
                </div>
                <div className="corner-text top-right">
                    <WalletMultiButton className={styles.walletButton} />
                </div>
            </div>

            <div className={styles.transferWidget_container}>
                <div className={styles.transferWidget}>
                    <div>Transfer $BRYAN</div>
                    {balance !== null && (
                        <div className={styles.balanceText}>Balance: {balance} $BRYAN</div>
                    )}
                    <br />
                    <div className={styles.formGroup}>
                        <label className={styles.inputLabel} htmlFor="recipient">Recipient Wallet Address</label>
                        <input
                            id="recipient"
                            type="text"
                            placeholder="Enter recipient address"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label   className={styles.inputLabel} htmlFor="amount">Amount ($BRYAN)</label>
                        <input
                            id="amount"
                            type="text"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={handleAmountChange}
                            className={styles.inputField}
                        />
                        {balance !== null && (
                            <div className={styles.percentageContainer}>
                                <button onClick={() => handlePercentageClick(0.1)}>10%</button>
                                <button onClick={() => handlePercentageClick(0.2)}>20%</button>
                                <button onClick={() => handlePercentageClick(0.5)}>50%</button>
                                <button onClick={() => handlePercentageClick(1)}>100%</button>
                            </div>
                        )}
                    </div>
                    <button onClick={handleTransfer} className={styles.transferButton}>
                        Transfer
                    </button>
                </div>

             
            </div>
        </>
    );
};

export default TransferWidget;
