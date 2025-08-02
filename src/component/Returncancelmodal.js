// ReturnCancelModal.jsx
import React from 'react';

const ReturnCancelModal = ({ isOpen, onClose, onSubmit, type }) => {
  const [reason, setReason] = React.useState("");

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onSubmit(reason.trim());
    setReason("");
    onClose();
  };

  return (
    isOpen && (
      <div className="mobile-modal-overlay">
        <div className="mobile-modal">
          <h5>{type === 'cancel' ? 'Cancel Order' : 'Return Order'}</h5>
          <textarea
            placeholder="Please provide your reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>Close</button>
            <button className="confirm-btn" onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ReturnCancelModal;
