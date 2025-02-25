import { useState } from 'react';

const TokenSelector = ({ onClose, onTokenSelect, selectedType }) => {
  const [tokens] = useState([
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'DAI', name: 'Dai Stablecoin' },
    { symbol: 'USDC', name: 'USD Coin' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin' },
  ]);

  return (
    <div className="modal-overlay">
      <div className="token-selector">
        <div className="modal-header">
          <h3>Select a token ({selectedType})</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="token-list">
          {tokens.map((token) => (
            <div 
              key={token.symbol} 
              className="token-item"
              onClick={() => {
                onTokenSelect(token.symbol);
                onClose();
              }}
            >
              <span className="token-symbol">{token.symbol}</span>
              <span className="token-name">{token.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenSelector;