import React, { useState, useEffect } from 'react';
import { useChain } from "@thirdweb-dev/react";
import { MANTA_PACIFIC_SEPOLIA, SCROLL_SEPOLIA } from './chainConfig';

const API_KEY = '962bcad84553bab6bdb48aefd1c1f9b0';

const endpoints = {
  [MANTA_PACIFIC_SEPOLIA.chainId]: {
    ERC20: 'https://api.studio.thegraph.com/query/90799/erc20-manta/version/latest',
    ERC721: 'https://api.studio.thegraph.com/query/90799/erc721-manta/version/latest',
    CCFG: 'https://api.studio.thegraph.com/query/90799/ccfg-manta/version/latest'
  },
  [SCROLL_SEPOLIA.chainId]: {
    ERC20: 'https://api.studio.thegraph.com/query/90799/erc20-scroll/version/latest',
    ERC721: 'https://api.studio.thegraph.com/query/90799/erc721-scroll/version/latest',
    CCFG: 'https://api.studio.thegraph.com/query/90799/ccfg-scroll/version/latest'
  }
};

function DataExplorer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState('ERC20');
  const chain = useChain();

  useEffect(() => {
    if (chain) {
      fetchData();
    }
  }, [chain, selectedEndpoint]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = endpoints[chain.chainId][selectedEndpoint];
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          query: `
            {
              tokens(first: 5) {
                id
                name
                symbol
                totalSupply
              }
            }
          `
        })
      });
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!chain) {
    return <div>Please connect to a supported network</div>;
  }

  return (
    <div>
      <h2>Data Explorer</h2>
      <div>
        <button onClick={() => setSelectedEndpoint('ERC20')}>ERC20</button>
        <button onClick={() => setSelectedEndpoint('ERC721')}>ERC721</button>
        <button onClick={() => setSelectedEndpoint('CCFG')}>CCFG</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}

export default DataExplorer;