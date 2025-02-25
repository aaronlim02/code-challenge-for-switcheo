import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="center">
        <form onsubmit="return !1">
          <div id="form-header">
            <h3>Swap</h3>
            <button id="settings-button">Set</button>
          </div>
          <div className='buy-sell-form'>
            <div className="input-container">
              <label className='buy-sell-form-title'>Sell</label>
              <input id="input-1" placeholder="0" />
              <input id="input-2" />
            </div>
            <button>select token</button>
          </div>
          <div className='buy-sell-form'>
            <div className="input-container">
              <label className='buy-sell-form-title'>Buy</label>
              <input id="output-1" placeholder="0" />
              <input id="output-2" />
              </div>
            <button>select token</button>
          </div>
          <button id="confirm-button">CONFIRM SWAP</button>
        </form>
      </div>
    </div>
  );
}

export default App;
