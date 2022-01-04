import React, { useState, useEffect, createContext } from 'react';
import { ethers } from 'ethers';

import { constractABI, contractAddress } from '../utils/constants';

export const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(contractAddress, constractABI, signer);

  console.log({
    provider,
    signer,
    transactionContract
  });
}

export const TransactionProvider = ({ children }) => {

  const [ connectedAccount, setConnectedAccount ] = useState("");

  const checkIfWalletIsConnected = async () => {
    if (!ethereum) return alert("Please install MetaMask Chrome Extension!");

    const accounts = await ethereum.request({method: 'eth_accounts'});

    console.log(accounts);
  }

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask Chrome Extension!");

      const accounts = await ethereum.request({method: 'eth_requestAccounts'});

      if (accounts.length) {
        console.log("Connected Account", connectedAccount);
        setConnectedAccount(accounts[0]);
      } else {
        console.log("no accounts found");
      }

    } catch (e) {
      console.log(e);

      throw new Error("No Ethereum Object");
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <TransactionContext.Provider value={{ connectWallet }}>
      {children}
    </TransactionContext.Provider>
  )
}