import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';

function App() {
  // Properties
  const [walletAddress, setWalletAddress] = useState("");
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  // Helper Functions

  // Requests access to the user's META MASK WALLET
  // https://metamask.io  0x07C88b415613D3462f961A781991F13772C4975c
  // async function ConnectMetamask() {
  const ConnectMetamask = async () => {
    console.log('Requesting account...');

    // ❌ Check if Meta Mask Extension exists 
    if(window.ethereum) {
      console.log('detected');

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log('Error connecting...');
      }

    } else {
      alert('Meta Mask not detected');
    }
  }

  // async function TransferButton () {
const TransferButton = async () => {
    console.log(`Button 2 clicked with value: ${input2}`);
    const tx = {
        from: walletAddress,
        to: input2,
        value: ethers.utils.parseUnits(input1, "ether").toHexString()
    }
    if(typeof window.ethereum !== 'undefined') {
        await ConnectMetamask();
    }

    //check if on Goerli net and change
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== '0x5') {
      try{
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: '0x5' }],
        });
        console.log('Changed chainId to 0x5');
      } catch(e){
        if(e.code===4902){
          try{
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{chainId:'0x5'}],
            });
            console.log('Add chainId: 0x5');
          } catch (addError) {
            console.error(addError);
          }
        }
      }
    } else {
      console.log(`Currently on chainId:${chainId}`);
    }

    await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx],
    }).then((txHash) => {
        console.log(txHash)
    }).catch((error) => {
        console.log('error')
        console.error(error);
    });
  }

  // const ShowInfo = async () => {
  //   try{
  //     const chainId = await window.ethereum.request({ method: "eth_chainId" });
  //     console.log(`chainId:${chainId}`);
  //     if (chainId !== '0x5') {
  //       await window.ethereum.request({
  //         method: "wallet_switchEthereumChain",
  //         params: [{ chainId: '0x5' }],
  //       });
  //       console.log('changed chainId to 0x5');
  //     }

  //   } catch (error){
  //     console.log(error)
  //   }
  // }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={ConnectMetamask}>Connect Metamask</button>
        <h3>Wallet Address: {walletAddress}</h3>
        <input
          type="text"
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
          placeholder="Enter Value in ETH"
        />
        <input
          type="text"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
          placeholder="Enter Receiver Address"
        />
        <button onClick={TransferButton}>Tranasfer </button>
        {/* <button onClick={ShowInfo}>Show Info</button> */}
      </header>
    </div>
  );
}

export default App;

