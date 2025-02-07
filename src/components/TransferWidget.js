import React, { useState, useEffect } from 'react';
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

// Your custom $BRYAN token constants
const TOKEN_MINT_ADDRESS = 'BrYANThKaAbjZZH5XWLrw26NzMbfUNmBwbZiMe4Fj5Mk';
const TOKEN_DECIMALS = 9; // Adjust this if your token uses a different decimal precision

const TransferWidget = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState(null);

    // Fetch the token balance when the wallet connects or the connection changes.
    useEffect(() => {
        if (!publicKey) {
            setBalance(null);
            return;
        }
        const fetchBalance = async () => {
            try {
                const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);
                // Derive the associated token account for the connected wallet
                const tokenAccountAddress = await getAssociatedTokenAddress(mintPublicKey, publicKey);
                // Get the token account balance
                const balanceInfo = await connection.getTokenAccountBalance(tokenAccountAddress);
                // Use uiAmount for a human-friendly display
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
            // Create PublicKey objects for the mint and recipient
            const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);
            const recipientPubKey = new PublicKey(recipient);

            // Derive the sender's associated token account for $BRYAN
            const senderTokenAddress = await getAssociatedTokenAddress(
                mintPublicKey,
                publicKey
            );

            // Derive the recipient's associated token account for $BRYAN
            const recipientTokenAddress = await getAssociatedTokenAddress(
                mintPublicKey,
                recipientPubKey
            );

            // Start building the transaction
            const transaction = new Transaction();

            // If the recipient's token account does not exist, add an instruction to create it
            const accountInfo = await connection.getAccountInfo(recipientTokenAddress);
            if (!accountInfo) {
                transaction.add(
                    createAssociatedTokenAccountInstruction(
                        publicKey,             // Payer of the account creation fee
                        recipientTokenAddress, // New associated token account
                        recipientPubKey,       // Owner of the token account
                        mintPublicKey          // Token mint
                    )
                );
            }

            // Convert the amount from a human-readable number to the token’s smallest unit
            const tokenAmount = Math.floor(parseFloat(amount) * Math.pow(10, TOKEN_DECIMALS));

            // Add the transfer instruction
            transaction.add(
                createTransferInstruction(
                    senderTokenAddress,    // Sender's associated token account
                    recipientTokenAddress, // Recipient's associated token account
                    publicKey,             // Owner of the sender's account
                    tokenAmount,           // Amount to transfer (in smallest unit)
                    [],
                    TOKEN_PROGRAM_ID       // SPL Token Program ID
                )
            );

            // Send and confirm the transaction
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');

            alert(`Transfer successful! Signature: ${signature}`);
        } catch (error) {
            console.error('Transfer failed:', error);
            alert('Transfer failed: ' + (error?.message || 'Unknown error'));
        }
    };

    // This handler ensures that only numbers (and at most one decimal point) can be entered.
    const handleAmountChange = (e) => {
        const { value } = e.target;
        // Allow empty value or a valid number with an optional single decimal point
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    // Set the amount based on a percentage of the balance.
    const handlePercentageClick = (percent) => {
        if (balance !== null) {
            // Optionally, round to a desired number of decimal places.
            setAmount((balance * percent).toString());
        }
    };

    return (
        <>
            <WalletMultiButton className={styles.walletButton} />
            <div className={styles.transferWidget}>
                <div>Transfer $BRYAN</div>
                {/* Display the available balance if it's been fetched */}
                {balance !== null && (
                    <div className={styles.balanceText}>Balance: {balance} $BRYAN</div>
                )}
                <br/>
                <div className={styles.formGroup}>
                    <label htmlFor="recipient">Recipient Wallet Address</label>
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
                    <label htmlFor="amount">Amount ($BRYAN)</label>
                    <input
                        id="amount"
                        type="text"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={handleAmountChange}
                        className={styles.inputField}
                    />
                    {/* Percentage buttons */}
                    {balance !== null && (
                        <div className={styles.percentageContainer}>
                            <button  onClick={() => handlePercentageClick(0.1)}>10%</button>
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
        </>
    );
};

export default TransferWidget;
