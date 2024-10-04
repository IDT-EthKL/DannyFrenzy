// src/App.js
import React from 'react';
import FishGame from './FishGame';

import useConnectWallet from './ConnectWallet';

function App() {
  const { connectWallet, walletAddress } = useConnectWallet();

  // if (!walletAddress) alert("Haven't sign in with Metamask"); connectWallet();

  return (
    <div className="App">
      {/* <h1>Fish Game</h1> */}
      {walletAddress ? <FishGame /> : 
        <div style={{maxWidth: "fit-content", position: 'absolute', top: '40%', transform: 'translateX(150%)', margin: '0'}}>
          <h1 style={{textAlign: 'center', fontSize : '80px'}}>Danny Frenzy</h1>
          <button style={{fontSize : '40px', marginLeft: '20%'}} onClick={connectWallet}>Connect Wallet</button>
        </div>
      }
      {/* {walletAddress && <p>Connected: {walletAddress}</p>} */}
      <style>{'body { background-image: url(../public/assets/bg.png); background-size: cover}'}</style>
    </div>
  );
}

export default App;
