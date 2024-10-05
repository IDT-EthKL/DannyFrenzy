import React from 'react';
import { ThirdwebProvider, ConnectWallet, useAddress, useChain, useSwitchChain } from "@thirdweb-dev/react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FishGame from './FishGame';
import DataExplorer from './DataExplorer';
import { MANTA_PACIFIC_SEPOLIA, SCROLL_SEPOLIA } from './chainConfig';

const supportedChains = [MANTA_PACIFIC_SEPOLIA, SCROLL_SEPOLIA];

function App() {
  return (
    <ThirdwebProvider
      activeChain={MANTA_PACIFIC_SEPOLIA}
      clientId="531042ef20779384d571e53ab4973e63"
      supportedChains={supportedChains}
    >
      <Router>
        <div className="App" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '40px', margin: 0 }}>Danny Frenzy</h1>
            <div>
              <Link to="/explorer" style={{ marginRight: '20px' }}>
                <button style={{ padding: '10px 20px' }}>Data Explorer</button>
              </Link>
              <ConnectWallet />
            </div>
          </div>
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/explorer" element={<DataExplorer />} />
          </Routes>
        </div>
        <style>{'body { background-image: url(../public/assets/bg.png); background-size: cover; margin: 0; padding: 0; }'}</style>
      </Router>
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
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
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
        <p style={{ textAlign: 'center' }}>Please select either Manta Pacific Sepolia or Scroll Sepolia network to play.</p>
      )}
    </div>
  );
}

export default App;