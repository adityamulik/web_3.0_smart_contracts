import React, { useState, useEffect, createContext } from 'react';
import { ethers } from 'ethers';

import { constractABI, contractAddress } from '../utils/constants';

export const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(contractAddress, constractABI, signer);

  return transactionContract;
  // console.log({
  //   provider,
  //   signer,
  //   transactionContract
  // });
}

export const TransactionProvider = ({ children }) => {

  const [ currentAccount, setCurrentAccount ] = useState("");
  const [ formData, setFormData ] = useState({
    addressTo: '',
    amount: '',
    keyword: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({
      ...prevState, [name]: e.target.value
    }));
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask Chrome Extension!");

      const accounts = await ethereum.request({method: 'eth_accounts'});

      if (accounts.length) {
        console.log("Connected Account", currentAccount);
        setCurrentAccount(accounts[0]);

        // Get all transactions
        // getAllTransactions();
      } else {
        console.log("no accounts found");
      }
    } catch (e) {
      console.log(e);
      throw new Error("No Ethereum Object");
    }    
  }

  const connectWallet = async () => {
    if (!ethereum) return alert("Please install MetaMask Chrome Extension!");

    const accounts = await ethereum.request({method: 'eth_requestAccounts'});

    setCurrentAccount(accounts[0]);
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask Chrome Extension!");

      // get the data from the form
      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();
      const parseAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: '0x5208', // hexadecimal - in 21000 gwei amount, less than ether.
          value: parseAmount._hex, // 0.00001
        }]
      });

      const transactionHash = await transactionContract.addToBlockChain(addressTo, parseAmount, message, keyword);

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();

      setTransactionCount(transactionCount.toNumber());

    } catch (c) {
      console.log(c);
    }
  }

  return (
    <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction }}>
      {children}
    </TransactionContext.Provider>
  )
}