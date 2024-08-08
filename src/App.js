
import './App.css';

import React, { useState, useRef } from "react";
import Web3 from "web3";


export default function App() {

    const [sendAddress, setSendAddress] = useState('');
    const [balance, setBalance] = useState('');
    const [receiverAddress, setReceiverAddress] = useState('');
    const [tokenAmount, setTokenAmount] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);




    const refSender = useRef('');
    const refReceiver = useRef('');
    const refToken = useRef('');



    const url1 = "HTTP://127.0.0.1:7545";
    const url2 = "https://mainnet.infura.io/v3/483de91e9957450c84147cad733cb116";

    const web3 = new Web3(url2);

    async function getBalance() {

        setLoading1(true);

        try {
            let bal = (await web3.eth.getBalance(sendAddress)).toString();
            setBalance(web3.utils.fromWei(bal, 'ether'));
            setLoading1(false);
        }
        catch (err) {
            setLoading1(false);
            setSendAddress("");
            setBalance("");
            refSender.current.focus();
            alert("Invalid Wallet Address!");
        }
    }

    async function transferToken() {
        if (balance == "") {
            alert("Enter Send Address!")
            return;
        }

        if (receiverAddress == "") {
            alert("Enter Receiver Address!");
            return;
        }
        if (tokenAmount == "") {
            alert("Enter Token Amount!");
            return;
        }


        try {
            let bal = (await web3.eth.getBalance(receiverAddress)).toString();


        }
        catch (err) {

            setReceiverAddress("");
            refReceiver.current.focus();
            alert("Invalid Receiver Wallet Address!");
            return;
        }

        if (parseFloat(tokenAmount) > parseFloat(balance)) {

            setTokenAmount("");
            refToken.current.focus();
            alert("Tokens Insufficient");
            return;
        }

        else {

            try {

                let key = prompt("Enter Private Key");
                if (!key || key == "") return;
                setPrivateKey(key);
                setLoading2(true);
                const nonce = await web3.eth.getTransactionCount(sendAddress);
                var gasPrice = (await web3.eth.getGasPrice()).toString();
                var gasLimit = (await web3.eth.getBlock("latest")).gasLimit

                const transaction = {


                    'to': receiverAddress,
                    'value': web3.utils.toWei(tokenAmount.toString(), 'ether'),
                    'gasLimit': parseInt(gasLimit),
                    'gasPrice': parseInt(gasPrice),
                    'nonce': nonce

                }
                console.log(transaction, "   ", privateKey);


                const signedTransaction = await web3.eth.accounts.signTransaction(transaction, privateKey);

                await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
                setLoading2(false);
                alert("Transaction Successful!");
                getBalance();



            }

            catch (err) {
                setLoading2(false);
                console.log(err);
                alert("Transaction Failed");

            }

        }


    }



    return (
        <div className='App'>
            <h1 className='heading1'>ERC20 Token Balance</h1>
            <div className='senderBackground'>
                <h3 className='heading2'>Ethereum Address</h3>
                <input placeholder='Enter Ethereum address'
                    onChange={(e) => setSendAddress(e.target.value)}
                    value={sendAddress}
                    ref={refSender}

                ></input>
                <button onClick={getBalance}
                    disabled={loading1 || loading2}
                >Submit</button>
            </div>
            {balance == "" ? null : <div className='balance'>
                <text>Token Balance</text>
                <text>{parseFloat(balance).toFixed(5)}</text>
            </div>
            }
            <h1 className='heading1'>Transfer ERC20 Tokens</h1>
            <div className='senderBackground' >
                <h3 className='heading2'>Recipient's Ethereum Address</h3>
                <input placeholder='Enter Ethereum address'
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    disabled={balance == ""}
                    ref={refReceiver}
                    value={receiverAddress}
                ></input>
                <h3 className='heading2'>Token Amount</h3>
                <input placeholder='Enter token amount'
                    type='number'
                    onChange={(e) => setTokenAmount(e.target.value)}
                    value={tokenAmount}
                    disabled={balance == ""}
                    ref={refToken}
                ></input>
                <button onClick={transferToken}
                    disabled={loading2 || balance == ""}
                >Transfer</button>
            </div>
        </div>
    );
}

