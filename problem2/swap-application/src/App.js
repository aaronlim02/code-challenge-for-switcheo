import './App.css';
import { useState, useEffect } from 'react';
import TokenSelector from './components/TokenSelector';
import ConnectWalletModal from './components/ConnectWalletModal';
import Notification from './components/Notification';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('sell');
  const [sellToken, setSellToken] = useState(null);
  const [buyToken, setBuyToken] = useState(null);
  const [inputValues, setInputValues] = useState({
    input1: '',
    input2: '',
    output1: '',
    output2: ''
  });
  const [wallet, setWallet] = useState({
    address: null,
    tokens: {}
  });
  const [notification, setNotification] = useState('');

  const handleTokenSelect = (token) => {
    if (selectedType === 'sell') {
      setSellToken(token);
    } else {
      setBuyToken(token);
    }
  };

  const handleSwap = () => {
    setInputValues(prev => ({
      input1: prev.output1,
      input2: prev.output2,
      output1: prev.input1,
      output2: prev.input2
    }));
    setSellToken(buyToken);
    setBuyToken(sellToken);
  };

  const handleConnectWallet = (walletData) => {
    setWallet({
      address: walletData.address,
      tokens: walletData.tokens
    });
    setIsWalletModalOpen(false);
  };

  const handleConfirmSwap = () => {
    if (!wallet.address) {
      setNotification({ type: 'error', message: 'Please connect wallet first!' });
      return;
    }
  
    if (!sellToken || !buyToken) {
      setNotification({ type: 'error', message: 'Please select both tokens' });
      return;
    }
  
    const inputAmount = parseFloat(inputValues.input1);
    const outputAmount = parseFloat(inputValues.output1);
  
    if (isNaN(inputAmount)) {
      setNotification({ type: 'error', message: 'Invalid input amount' });
      return;
    }
  
    // Get initial balances
    const initialSellBalance = wallet.tokens[sellToken.currency] || 0;
    const initialBuyBalance = wallet.tokens[buyToken.currency] || 0;
  
    if (initialSellBalance < inputAmount) {
      setNotification({ 
        type: 'error', 
        message: 'Insufficient funds!',
        details: 'You only have: ' + initialSellBalance + ' ' + sellToken.currency });
      return;
    }
  
    // Calculate new balances
    const newTokens = { ...wallet.tokens };
    const finalSellBalance = initialSellBalance - inputAmount;
    const finalBuyBalance = initialBuyBalance + outputAmount;
  
    newTokens[sellToken.currency] = finalSellBalance;
    if (finalSellBalance <= 0) delete newTokens[sellToken.currency];
    
    newTokens[buyToken.currency] = finalBuyBalance;
  
    setWallet(prev => ({ ...prev, tokens: newTokens }));
  
    setNotification({
      type: 'success',
      message: 'Transaction succeeded!',
      details: {
        sellToken: sellToken.currency,
        buyToken: buyToken.currency,
        soldAmount: inputAmount,
        boughtAmount: outputAmount,
        fromSell: initialSellBalance.toFixed(4),
        toSell: finalSellBalance.toFixed(4),
        fromBuy: initialBuyBalance.toFixed(4),
        toBuy: finalBuyBalance.toFixed(4)
      }
    });
  };

  // Calculation effect
  useEffect(() => {
    if (!inputValues.input1 || !sellToken || !buyToken) {
      setInputValues((prev) => ({
        ...prev,
        input2: '',
        output1: '',
        output2: ''
      }));
      return;
    }

    const inputAmount = parseFloat(inputValues.input1);
    if (isNaN(inputAmount)) return;

    // Calculate USD values
    const inputUSD = inputAmount * sellToken.price;
    const outputUSD = inputUSD;

    // Calculate output token amount
    const outputAmount = inputUSD / buyToken.price;

    setInputValues({
      input1: inputValues.input1,
      input2: inputUSD.toFixed(2),
      output1: outputAmount.toFixed(6),
      output2: outputUSD.toFixed(2)
    });
  }, [inputValues.input1, sellToken, buyToken]);

  return (
    <div className="App">
      <div className="center">
        <form onSubmit={(e) => e.preventDefault()}>
          <div id="form-header">
            <h3>Swap</h3>
            <button 
              id="connect-button"
              type="button"
              onClick={() => setIsWalletModalOpen(true)}
            >
              {wallet.address ? wallet.address.substring(0,8) + "..." : 'Connect Wallet'}
            </button>
          </div>
          <div className='buy-sell-form'>
            <div className="input-container">
              <label className='buy-sell-form-title'>Sell</label>
              <input
                id="input-1"
                placeholder="0"
                value={inputValues.input1}
                onChange={(e) => setInputValues((prev) => ({
                  ...prev,
                  input1: e.target.value
                }))}
              />
              <input
                id="input-2"
                disabled
                value={inputValues.input2 ? "$" + inputValues.input2 : ''}
              />
            </div>
            <button 
              className="choose-currency-button"
              type="button"
              onClick={() => {
                setSelectedType('sell');
                setIsModalOpen(true);
              }}
            >
              {sellToken ? <img
                src={`${process.env.PUBLIC_URL}/images/${sellToken.currency}.svg`}
                alt=""
                className="token-icon"
                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
              /> : ""}
              {sellToken?.currency || 'Select Token'}
            </button>
          </div>

          {/* Swap Button */}
          <div className="swap-button-container">
            <button
              type="button"
              className="swap-button"
              onClick={handleSwap}
            >
              v
            </button>
          </div>

          <div className='buy-sell-form'>
            <div className="input-container">
              <label className='buy-sell-form-title'>Buy</label>
              <input
                id="output-1"
                disabled
                placeholder="0"
                value={inputValues.output1 || ''}
              />
              <input
                id="output-2"
                disabled
                value={inputValues.output2 ? "$" + inputValues.output2 : ''}
              />
            </div>
            <button
              className="choose-currency-button"
              type="button"
              onClick={() => {
                setSelectedType('buy');
                setIsModalOpen(true);
              }}
            >
              {buyToken ? <img
                src={`${process.env.PUBLIC_URL}/images/${buyToken.currency}.svg`}
                alt=""
                className="token-icon"
                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
              /> : ''} 
              {buyToken?.currency || 'Select Token'}
            </button>
          </div>
          <button 
            id="confirm-button"
            type="button"
            onClick={handleConfirmSwap}
          >
            Confirm Swap
          </button>
        </form>
      </div>
      {isModalOpen && (
        <TokenSelector
          onClose={() => setIsModalOpen(false)}
          onTokenSelect={handleTokenSelect}
          selectedType={selectedType}
        />
      )}

      {isWalletModalOpen && (
        <ConnectWalletModal
          onClose={() => setIsWalletModalOpen(false)}
          onConnect={handleConnectWallet}
        />
      )}

      {notification && (
        <Notification 
          notification={notification} 
          sellToken={sellToken} 
          buyToken={buyToken} 
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default App;