import React, { useState, useEffect } from 'react';
import { Web3 } from 'web3';
import Marketplace from '../abis/Marketplace.json'


window.web3 = new Web3(window.ethereum);
const web3 = window.web3
const networkId = await web3.eth.net.getId()
const contract = new web3.eth.Contract(Marketplace.abi, Marketplace.networks[networkId].address)

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [warning, setWarning] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [name, setName] = useState('')
  const [productList, setProductList] = useState([])

  const getName = async () => {
    const _name = await contract.methods.name().call()
    setName(_name)
  }

  const getProductList = async () => {
    const productCount = await contract.methods.productCount().call()
    const allProducts = []
    for (var i = 1; i <= productCount; i++) {
      const task = await contract.methods.products(i).call();
      allProducts.push(task)
    }
    setProductList(allProducts)
  }


  useEffect(() => {
    // ensure that there is an injected the Ethereum provider
    if (window.ethereum) {
      // use the injected Ethereum provider to initialize Web3.js
      setWeb3(new Web3(window.ethereum));
      // check if Ethereum provider comes from MetaMask
      if (window.ethereum.isMetaMask) {
        setProvider("Connected to Ethereum with MetaMask.");
      } else {
        setProvider("Non-MetaMask Ethereum provider detected.");
      }
    } else {
      // no Ethereum provider - instruct user to install MetaMask
      setWarning("Please install MetaMask");
    }
  }, []);

  useEffect(() => {
    async function getChainId() {
      if (web3 === null) {
        return;
      }

      // get chain ID and populate placeholder
      setChainId(`Chain ID: ${await web3.eth.getChainId()}`);
    }

    async function getLatestBlock() {
      if (web3 === null) {
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const allAccounts = await web3.eth.getAccounts();
      setAccounts(allAccounts);

      // get latest block and populate placeholder
      setLatestBlock(`Latest Block: ${await web3.eth.getBlockNumber()}`);
    }

    getChainId();
    getLatestBlock();
  }, [web3]);

  useEffect(() => {
    getName();
    getProductList()
  }, [])

  if (!accounts) {
    return "loading..."
  }

  const handleClick = (id) => {
    console.log("event", id)
  }

  const getProducts = () => {
    return productList.map((product, i) => {
      return (
        <tr style={{height: "50px"}} key={i}>
      <td>{product.id.toString()}</td>
      <td key={i}>{product.name}</td>
      <td><button style={{width: "200px"}} onClick={() => handleClick(product.id.toString())}>Buy</button></td>
      </tr>)
    })
  }

  return (
    <>
      <div id="warn" style={{ color: "red" }}>
        {warning}
      </div>
      <header style={{ backgroundColor: "#ccc" }}>
        <div id="provider">{provider}</div>
        <div id="chainId">{chainId}</div>
        <div>Seller account - {accounts[1]}</div>
        <div>Buyer account - {accounts[2]}</div>
      </header>
      <br />
      <h1>List Products of {name}</h1>
      <table>
        <thead>
        <tr style={{ backgroundColor: "#ddd" }}>
          <th width="200px">Number</th>
          <th width="200px">Name</th>
          <th width="200px">Status</th>
        </tr>
        </thead>
        <tbody>{getProducts()}</tbody>
      </table>
    </>
  );
}

export default App;
