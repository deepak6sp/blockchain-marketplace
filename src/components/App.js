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
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')

  const getName = async () => {
    const _name = await contract.methods.name().call()
    setName(_name)
  }

  const getProductList = async () => {
    const productCount = await contract.methods.productCount().call()
    console.log("productCount", productCount)
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
    console.log({ productList })
    return productList.map((product, i) => {
      return (
        <tr height="50" key={i}>
          <td>{product.id.toString()}</td>
          <td key={i}>{product.name}</td>
          <td><button style={{ width: "200px" }} onClick={() => handleClick(product.id.toString())}>Buy</button></td>
        </tr>)
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("submitting...")
    const newProduct = await contract.methods.createProduct(productName, productPrice).send({ from: accounts[0] })
    console.log("submitted", newProduct)
    window.location.reload()
  }


  const handleProductName = (event) => {
    setProductName(event.target.value)
  }

  const handlePrice = (event) => {
    setProductPrice(event.target.value)
  }

  return (
    <>
      <div id="warn" style={{ color: "red" }}>
        {warning}
      </div>
      <header style={{ backgroundColor: "#ccc" }}>
        <div id="provider">{provider}</div>
        <div id="chainId">{chainId}</div>
        <div>Seller account - {accounts[0]}</div>
        <div>Buyer account - {accounts[1]}</div>
      </header>
      <br />
      <div style={{ margin: "10px" }}>
        <h3>Add product</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "400px" }}>
          <input type="text" onChange={handleProductName} value={productName} placeholder='enter product name here' />
          <br />
          <input type="text" onChange={handlePrice} value={productPrice} placeholder='enter product price here' />
          <br />
          <button type="submit">Submit</button>
        </form>
        <br></br>
        <hr/>
        <h3>List Products from {name}</h3>
        <table>
          <thead>
            <tr style={{ backgroundColor: "#ddd" }}>
              <th width="200">Number</th>
              <th width="200">Name</th>
              <th width="200">Status</th>
            </tr>
          </thead>
          <tbody>{getProducts()}</tbody>
        </table>
      </div>
    </>
  );
}

export default App;
