// App.js
import React from 'react';
import { ThirdwebProvider, ConnectWallet, useAddress, useChain, useSwitchChain } from "@thirdweb-dev/react";
import FishGame from './FishGame';

const MANTA_PACIFIC_SEPOLIA = {
  chainId: 3441006,
  rpc: ["https://pacific-rpc.sepolia-testnet.manta.network/http"],
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  shortName: "manta-sepolia",
  slug: "manta-sepolia",
  testnet: true,
  chain: "Manta Pacific Sepolia",
  name: "Manta Pacific Sepolia Testnet",
};

const SCROLL_SEPOLIA = {
  chainId: 534351,
  rpc: ["https://sepolia-rpc.scroll.io"],
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  shortName: "scroll-sepolia",
  slug: "scroll-sepolia",
  testnet: true,
  chain: "Scroll Sepolia",
  name: "Scroll Sepolia Testnet",
};

const supportedChains = [MANTA_PACIFIC_SEPOLIA, SCROLL_SEPOLIA];

function App() {
  return (
    <ThirdwebProvider
      activeChain={MANTA_PACIFIC_SEPOLIA}
      clientId="531042ef20779384d571e53ab4973e63"
      supportedChains={supportedChains}
    >
      <div className="App">
        <ConnectWallet />
        <MainContent />
      </div>
      <style>{'body { background-image: url(../public/assets/bg.png); background-size: cover}'}</style>
    </ThirdwebProvider>
  );
}

function MainContent() {
  const address = useAddress();
  const chain = useChain();
  const switchChain = useSwitchChain();

  const switchToManta = () => switchChain(MANTA_PACIFIC_SEPOLIA.chainId);
  const switchToScroll = () => switchChain(SCROLL_SEPOLIA.chainId);

  if (!address) {
    return (
      <div style={{ maxWidth: "fit-content", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <h1 style={{ textAlign: 'center', fontSize: '80px' }}>Danny Frenzy</h1>
        <p>Please connect your wallet to play.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <button 
          onClick={switchToManta} 
          style={{
            backgroundColor: chain?.chainId === MANTA_PACIFIC_SEPOLIA.chainId ? 'lightblue' : 'blue',
            color: 'white',
            padding: '10px 20px',
            margin: '0 10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Play on Manta
        </button>
        <button 
          onClick={switchToScroll} 
          style={{
            backgroundColor: chain?.chainId === SCROLL_SEPOLIA.chainId ? 'lightorange' : 'orange',
            color: 'white',
            padding: '10px 20px',
            margin: '0 10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Play on Scroll
        </button>
      </div>
      {(chain?.chainId === MANTA_PACIFIC_SEPOLIA.chainId || chain?.chainId === SCROLL_SEPOLIA.chainId) ? (
        <FishGame />
      ) : (
        <p>Please select either Manta Pacific Sepolia or Scroll Sepolia network to play.</p>
      )}
    </div>
  );
}

export default App;