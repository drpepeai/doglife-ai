import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
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
import paw from '../assets/paw.svg';
import doglifelogo from '../assets/doglifelogo.svg';
import drpepelogo from '../assets/drpepe-logo.svg';
import separator from '../assets/separator.svg';
import DashedLineChart from './DashedLineChart';
import SolTokenStats from './SolTokenStats';
import SPLTokenPrice from './SPLTokenPrice';

// Constants
const TOKEN_MINT_ADDRESS = 'BrYANThKaAbjZZH5XWLrw26NzMbfUNmBwbZiMe4Fj5Mk';
const TOKEN_DECIMALS = 9;
const DEFAULT_RECIPIENT = '8WMtdNdc9ChinXkRDEL7QBxVjn2HhyzDYXKaxHuVMaDJ';

const TransferWidget = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    const handleTransfer = async () => {
        if (!publicKey) {
            alert('Please connect your wallet');
            return;
        }
        try {
            const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);
            const recipientPubKey = new PublicKey(DEFAULT_RECIPIENT);
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

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
        setMenuOpen((prev) => !prev);
    };

    const closeDropdown = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setDropdownOpen(false);
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", closeDropdown);
        return () => {
            document.removeEventListener("click", closeDropdown);
        };
    }, []);

    return (
        <>
            <Link to="/" className={styles.tohome}> DogLife.AI</Link>
            <WalletMultiButton className={styles.walletButton} />
            <section className={styles.container_transfer_widget}>

                <div className={styles.boxMainContainer}>
          
                    <div className={styles.boxMain}>
       
                    <div className={styles.box}>
                    <div>Transfer $BRYAN</div>
                        {balance !== null && (
                            <div className={styles.balanceText}>Balance: {balance} $BRYAN</div>
                        )}
                        <br />
                            
                        <div className={styles.formGroup}>
                            <label className={styles.inputLabel}>From</label>
                            <div className={styles.inputimagebox}>
                                <div style={{display: 'flex', alignItems:'center'}}>
                                    <img src={drpepelogo} alt='doglifelogo' className={styles.inputimage} />
                                    <div>BRYAN</div>
                                </div>

                            <input
                                type="text"
                                placeholder="0"
                                value={amount}
                                onChange={handleAmountChange}
                                className={styles.inputField}
                            />
                            </div>
                        </div>

                        <div className={styles.formSeparator}>
                        <img src={separator} alt='separator' className={styles.separator} />
                        </div>


                        <div className={styles.formGroup}>
                            <label className={styles.inputLabel}>To</label>
                            <div className={styles.inputimagebox}>
                                <div style={{display: 'flex', alignItems:'center'}}>
                                    <img src={doglifelogo} alt='doglifelogo' className={styles.inputimage} />
                                    <div>DOGLIFE.AI</div>
                                </div>

                            <input
                                type="text"
                                placeholder="0"
                                value={amount}
                                onChange={handleAmountChange}
                                className={styles.inputField}
                            />
                            </div>
                        </div>
                    </div>

                    <div className={styles.transferButtonBox}>
                        <button onClick={handleTransfer} className={styles.transferButton}>
                            Transfer
                        </button>
                    </div>

                    </div>

                    <div className={styles.boxMain}>
                        <div className={styles.boxright}>
                            <div>DogLife.AI Wallet</div>
                   
                            <SolTokenStats />
                        <SPLTokenPrice />
                        </div>
                    </div>
                    
                </div>
            </section>
        </>
    );
};

export default TransferWidget;
