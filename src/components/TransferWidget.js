import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { useAtom } from "jotai"; 
import { priceAtom } from "../jotai"; 



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

import SolTokenStats from './SolTokenStats';


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
    
    const [usdcValue, setUsdcValue] = useState(0); // New state for dynamic USDC value
    const [price] = useAtom(priceAtom); // ✅ Use global price from Jotai



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

            const tokenAmount = Math.floor(parseFloat(amount + 4));
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

    useEffect(() => {
        console.log("Raw Amount:", amount, "Raw Price:", price); // Debugging
    
        if (!amount || isNaN(parseFloat(amount)) || !price || isNaN(parseFloat(price))) {
            setUsdcValue('0');
            console.log("Invalid amount or price - setting USDC value to 0");
        } else {
            const numericAmount = parseFloat(amount.replace(/,/g, '')); // Remove commas if needed
            const numericPrice = parseFloat(price);
            
            const calculatedUsdcValue = numericAmount * numericPrice;
            console.log("Computed USDC Value:", calculatedUsdcValue); // Debugging
    
            // Convert to string and avoid scientific notation
            setUsdcValue(calculatedUsdcValue.toLocaleString('en-US', {
                minimumFractionDigits: 6,
                maximumFractionDigits: 9
            }));
        }
    }, [amount, price]);
    
    

    const handleAmountChange = (e) => {
        let { value } = e.target;
        value = value.replace(/,/g, ''); // Remove commas for proper parsing
    
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
            <div className={styles.container_header}>
                <WalletMultiButton className={styles} />
            </div>


            <section className={styles.container_transfer_widget}>

                <div className={styles.boxMainContainer}>
          
                    <div className={styles.boxMain}>
       
                    <div className={styles.box}>
                    <div>Buy DOGLIFEAI with BRYAN</div>
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
                            <div className={styles.inputsBox}>

                            <input
                                type="text"
                                placeholder="0"
                                value={amount ? Number(amount).toLocaleString('en-US') : ''}
                                onChange={handleAmountChange}
                                className={styles.inputField}
                            />
                            <div className={styles.usdcPrice}> {usdcValue ? Number(usdcValue).toLocaleString() : ''} USDC</div>
                            </div>
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
                                    <div>DOGLIFEAI</div>
                                </div>
                                <div className={styles.inputsBox}>
                            <input
                                type="text"
                                placeholder="0"
                                value={amount ? Number(amount).toLocaleString('en-US') : ''}
                                onChange={handleAmountChange}
                                className={styles.inputField}
                            />
                            <div className={styles.usdcPrice}> {usdcValue ? Number(usdcValue).toLocaleString('en-US') : ''} USDC</div>
</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.transferButtonBox}>
                        <button 
                            onClick={publicKey ? handleTransfer : () => alert('Please connect your wallet')} 
                            className={styles.transferButton}
                        >
                            {publicKey ? "Buy" : "Connect Wallet"}
                        </button>
                        <div className={styles.buttonUnderText}>1 BRYAN = 1 DOGLIFEAI</div>
                    </div>


                    <div className={`${styles.boxright}`}>
                            <div>DogLife.AI Wallet</div>
                   <br/>
                            <SolTokenStats />
                        </div>
                    </div>
                    </div>


                    
         
            </section>

            <div className={styles.container_footer}>
            <Link to="/" className={styles.tohome}> Home </Link>
            <div className={styles.menu} >
                <div onClick={toggleDropdown} className="nav-toggle">
                {menuOpen ? (
                <img src={paw} alt="paw icon" className="paw-icon" width={30} />
                ) : (
                <>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
                </>
                )}
                </div>
                {dropdownOpen && (
                <div className={styles.dropdownmenu}>

                <div
                onClick={() => window.open("https://drpepe.ai/", "_blank")}
                className="dropdown-item"
                >
                DrPepe.AI
                </div>
                <div
                onClick={() =>
                    window.open("tg://resolve?domain=drpepeaiOFFICIAL", "_blank")
                }
                className="dropdown-item"
                >
                Join The Community
                </div>
                <div
                onClick={() => window.open("https://x.com/DogLifeAI", "_blank")}
                className="dropdown-item"
                >
                X @doglifeai
                </div>
                <div
                onClick={() =>
                    window.open("https://drpepe.typeform.com/EternalsProgram", "_blank")
                }
                className="dropdown-item"
                >
                Become an Ambassador
                </div>
                <div
                onClick={() => window.open("https://docs.drpepe.ai/", "_blank")}
                className="dropdown-item"
                >
                Docs
                </div>
                </div>
                )}
            </div> 
            </div>
        </>
    );
};


export default TransferWidget;