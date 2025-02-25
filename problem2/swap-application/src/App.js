import './App.css';
import { useState, useEffect } from 'react';
import TokenSelector from './components/TokenSelector';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('sell');
  const [sellToken, setSellToken] = useState(null);
  const [buyToken, setBuyToken] = useState(null);
  const [inputValues, setInputValues] = useState({
    input1: '',
    input2: '',
    output1: '',
    output2: ''
  });

  const handleTokenSelect = (token) => {
    if (selectedType === 'sell') {
      setSellToken(token);
    } else {
      setBuyToken(token);
    }
  };

  // Swap functionality
  const handleSwap = () => {
    // Swap input and output values
    setInputValues((prev) => ({
      input1: prev.output1,
      input2: prev.output2,
      output1: prev.input1,
      output2: prev.input2
    }));

    // Swap sellToken and buyToken
    setSellToken(buyToken);
    setBuyToken(sellToken);
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
            <button id="connect-button">Connect Wallet</button>
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
                value={"$" + inputValues.input2 || ''}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedType('sell');
                setIsModalOpen(true);
              }}
            >
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
                value={"$" + inputValues.output2 || ''}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedType('buy');
                setIsModalOpen(true);
              }}
            >
              {buyToken?.currency || 'Select Token'}
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