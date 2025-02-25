import './App.css';
import { useState } from 'react';
import TokenSelector from './components/TokenSelector';

function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('sell');
  const [sellToken, setSellToken] = useState('Select Token');
  const [buyToken, setBuyToken] = useState('Select Token');

  const handleTokenSelect = (tokenSymbol) => {
    if (selectedType === 'sell') {
      setSellToken(tokenSymbol);
    } else {
      setBuyToken(tokenSymbol);
    }
  };

  return (
    <div className="App">
      <div className="center">
        <form onsubmit="return !1">
          <div id="form-header">
            <h3>Swap</h3>
            <button id="connect-button">Connect Wallet</button>
          </div>
          <div className='buy-sell-form'>
            <div className="input-container">
              <label className='buy-sell-form-title'>Sell</label>
              <input id="input-1" placeholder="0" />
              <input id="input-2" disabled />
            </div>
            <button 
              type="button"
              onClick={() => {
                setSelectedType('sell');
                setIsModalOpen(true);
              }}
            >
              {sellToken}
            </button>
          </div>
          <div className='buy-sell-form'>
            <div className="input-container">
              <label className='buy-sell-form-title'>Buy</label>
              <input id="output-1" disabled placeholder="0" />
              <input id="output-2" disabled />
              </div>
              <button 
                type="button"
                onClick={() => {
                  setSelectedType('buy');
                  setIsModalOpen(true);
                }}
              >
              {buyToken}
            </button>
          </div>
          <button id="confirm-button">CONFIRM SWAP</button>
        </form>
      </div>
      {isModalOpen && (
        <TokenSelector
          onClose={() => setIsModalOpen(false)}
          onTokenSelect={handleTokenSelect}
          selectedType={selectedType}
        />
      )}
    </div>
  );
}

export default App;
