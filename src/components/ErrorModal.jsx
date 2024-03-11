import React from "react";
import "../styles/errorMessage.css"

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="error-modal">
      <div className="error-content">
        <h3>Error</h3>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ErrorModal;
