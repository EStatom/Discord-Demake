import React, { useState } from 'react';
import './../styles/Modal.css';  // You can add custom styles for the modal

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-buttons">
                    <button className="modal-confirm" onClick={onConfirm}>Confirm</button>
                    <button className="modal-cancel" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
