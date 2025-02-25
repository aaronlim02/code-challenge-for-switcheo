import { useState, useEffect } from 'react';

const TokenSelector = ({ onClose, onTokenSelect, selectedType }) => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // Fetch JSON data from the link
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch('https://interview.switcheo.com/prices.json'); // Replace with your JSON link
        if (!response.ok) {
          throw new Error('Failed to fetch tokens');
        }
        const data = await response.json();
        setTokens(data); // Assuming the JSON is an array of tokens
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  // Filter tokens based on search query
  const filteredTokens = tokens
    .filter((token, index, self) =>
      index === self.findIndex((t) => t.currency === token.currency)
    )
    .filter((token) =>
      token.currency.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (loading) {
    return <div>Loading tokens...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="modal-overlay">
      <div className="token-selector">
        <div className="modal-header">
          <h3>Select a token ({selectedType})</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="token-list">
          {filteredTokens.map((token) => (
            <div
              key={token.currency}
              className="token-item"
              onClick={() => {
                onTokenSelect(token);
                onClose();
              }}
            >
              <img
                src={`/images/${token.currency}.svg`}
                alt={token.currency}
                className="token-icon"
                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
              />
              <span className="token-symbol">{token.currency}</span>
              <span className="token-price">{token.price.toFixed(2)} USD</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenSelector;