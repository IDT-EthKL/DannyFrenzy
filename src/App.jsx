// src/App.js
import React from 'react';
import FishGame from './FishGame';
import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider, ConnectEmbed, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

const wallets = [
  createWallet("io.metamask"),
  createWallet("walletConnect"),
];

const client = createThirdwebClient({ clientId: "531042ef20779384d571e53ab4973e63" });

function App() {
  return (
    <ThirdwebProvider>
      <MainContent />
    </ThirdwebProvider>
  );
}

function MainContent() {
  const account = useActiveAccount();

  return (
    <div className="App">
      {account?.address ? (
        <FishGame />
      ) : (
        <div style={{ maxWidth: "fit-content", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <h1 style={{ textAlign: 'center', fontSize: '80px' }}>Danny Frenzy</h1>
          {/* <button
            style={{ fontSize: '40px', marginLeft: '20%' }}
            onClick={() => {
              // Optionally, add more wallet connection logic here
              alert('Connect your wallet');
            }}
          >
            Connect Wallet
          </button> */}
          <ConnectEmbed style={{margin: 'auto'}} client={client} wallets={wallets} />
        </div>
      )}

      {/* {document.body.style.backgroundImage = 'url(../public/assets/bg.png)'}
      {document.body.style.backgroundSize = 'cover' } */}
      <style>{'body { background-image: url(../public/assets/bg.png); background-size: cover}'}</style>
    </div>
  );
}

export default App;
