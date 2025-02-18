import React, { useState, useEffect, useRef } from 'react';

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

import BryanTokenStats from './BryanTokenStats';



// Token Constants
const TOKEN_MINT_ADDRESS = 'BrYANThKaAbjZZH5XWLrw26NzMbfUNmBwbZiMe4Fj5Mk';
const TOKEN_DECIMALS = 9; 

const TransferWidget = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState(null);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); // State for hamburger menu animation
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


    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
        setMenuOpen((prev) => !prev); // Ensure hamburger toggles properly
      };
    
      const closeDropdown = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setDropdownOpen(false);
          setMenuOpen(false); // Ensure hamburger resets if clicked outside
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
       
            <div className="corner-text top-right">
                <WalletMultiButton className={styles.walletButton} />
            </div>
            <section className={styles.container_transfer_widget}>

                <div className={styles.box}>
           
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

                <div className={styles.box}>

                    <BryanTokenStats/>

                    
                </div>



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



            </section>


        </>
    );
};

export default TransferWidget;
