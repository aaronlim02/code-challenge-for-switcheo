import React from 'react';

const Notification = ({ notification, sellToken, buyToken, onClose }) => {
  if (!notification) return null;

  return (
    <div className={`notification ${notification.type}`}>
      <div className="notification-content">
        <strong>{notification.message}</strong>

        {/* Display details for error messages */}
        {notification.type === 'error' && notification.details && (
          <p className="error-details">{notification.details}</p>
        )}

        {notification.type === 'success' && notification.details && (
          <div className="transaction-details">
            <div id="transaction-symbols">
              <img src={`${process.env.PUBLIC_URL}/images/${sellToken?.currency}.svg`} alt="" className="token-icon" />
              <p>→</p>
              <img src={`${process.env.PUBLIC_URL}/images/${buyToken?.currency}.svg`} alt="" className="token-icon" />
            </div>
            <p>Sold {notification.details.soldAmount.toFixed(4)} {notification.details.sellToken}</p>
            <p>{notification.details.sellToken} balance: {notification.details.fromSell} → {notification.details.toSell}</p>
            <p>Received {notification.details.boughtAmount.toFixed(4)} {notification.details.buyToken}</p>
            <p>{notification.details.buyToken} balance: {notification.details.fromBuy} → {notification.details.toBuy}</p>
          </div>
        )}
      </div>

      <button className="close-notification" onClick={onClose}>×</button>
    </div>
  );
};

export default Notification;