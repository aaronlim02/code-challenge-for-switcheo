const ConnectWalletModal = ({ onClose, onConnect }) => {
  const handleConnect = () => {
    // In real implementation, you would connect actual wallet here
    onConnect({
      address: '0xSampleWallet123',
      tokens: {"ETH": 1}
    });
  };

  return (
    <div className="modal-overlay">
      <div className="wallet-modal">
        <div className="modal-header">
          <h3>Connect Wallet</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="wallet-list">
          <div className="wallet-item" onClick={handleConnect}>
            <div className="wallet-info">
              <p className="wallet-name">0xSample...</p>
              <p className="wallet-details">Contains 1 ETH</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletModal;