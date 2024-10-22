import React, { useState, useEffect } from 'react';
import './../styles/Modal.css';  // Reuse the modal styles

const AddChannelModal = ({ isOpen, onConfirm, onCancel }) => {
    // Initialize the channelName state
    const [channelName, setChannelName] = useState('');

    // Reset the input field when the modal is closed
    useEffect(() => {
        if (!isOpen) {
            setChannelName('');  // Clear the input when the modal closes
        }
    }, [isOpen]);

    // Function to clear the input field after adding a channel
    const clearInput = () => {
        setChannelName('');  // Reset the channel name
    };

    // Return null if the modal is not open
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Add a New Channel</h3>
                <input 
                    type="text" 
                    value={channelName} 
                    onChange={(e) => setChannelName(e.target.value)}  // Update channel name state on input change
                    placeholder="Channel Name"
                    className="modal-input"
                />
                <div className="modal-buttons">
                    <button 
                        className="modal-confirm" 
                        onClick={() => onConfirm(channelName, clearInput)}  // Pass clearInput function to onConfirm
                    >
                        Add Channel
                    </button>
                    <button className="modal-cancel" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddChannelModal;
