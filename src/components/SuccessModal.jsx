import React from 'react';
import '../styles/SuccessModal.css';

function SuccessModal({ message, onClose }) {
  return (
    <div className="success-modal">
      <div className="success-modal-content">
        <div className="success-modal-header">
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <div className="success-modal-body">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;
