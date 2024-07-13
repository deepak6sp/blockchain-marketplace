import React, { useState, useEffect } from 'react';
const Web3 = require('web3')

// class App extends Component {
//   render() {
//     return (
//       <div>
//         <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
//           <a
//             className="navbar-brand col-sm-3 col-md-2 mr-0"
//             href="http://www.dappuniversity.com/bootcamp"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Dapp University
//           </a>
//         </nav>
//         <div className="container-fluid mt-5">
//           <div className="row">
//             <main role="main" className="col-lg-12 d-flex text-center">
//               <div className="content mr-auto ml-auto">
//                 <a
//                   href="http://www.dappuniversity.com/bootcamp"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <img src={logo} className="App-logo" alt="logo" />
//                 </a>
//                 <h1>Dapp University Starter Kit</h1>
//                 <p>
//                   Edit <code>src/components/App.js</code> and save to reload.
//                 </p>
//                 <a
//                   className="App-link"
//                   href="http://www.dappuniversity.com/bootcamp"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   LEARN BLOCKCHAIN <u><b>NOW! </b></u>
//                 </a>
//               </div>
//             </main>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

const App = () => {
    const [test, setTest] = useState('asda')
    const [web3, setWeb3] = useState(null);
    const [warning, setWarning] = useState(null);
    const [provider, setProvider] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [latestBlock, setLatestBlock] = useState(null);
    const [accounts, setAccounts] = useState(null);

    useEffect(() => {
      setTest("real")
    })

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

    console.log('accounts',accounts)
    if(!accounts) {
      return "loading..."
    }

    return (
      <>
        <div id="warn" style={{ color: "red" }}>
          {warning}
        </div>
        <div id="provider">{provider}</div>
        <div id="chainId">{chainId}</div>
        <div id="latestBlock">Seller account - {accounts[1]}</div>
      </>
    );
}

export default App;
