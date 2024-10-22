import React from 'react';
import { Settings } from 'lucide-react';
import './../styles/ChannelList.css';  

const ChannelList = ({ serverDetails, onSelectChannel }) => {
    // Mock channels for now
    const channels = [
        { id: 'general', name: 'General' },
        { id: 'announcements', name: 'Announcements' },
        { id: 'gaming', name: 'Gaming' },
    ];

    // Ensure serverDetails is not null before trying to access it
    if (!serverDetails) {
        return <div className="channel-list-container">Loading channels...</div>;
    }

    return (
        <div className="channel-list-container">
            <div className="server-header">
                <h2>{serverDetails.name}</h2>
                <Settings className="settings-icon" />  {/* Cog wheel icon */}
            </div>
            <ul>
                {channels.map((channel) => (
                    <li key={channel.id} onClick={() => onSelectChannel(serverDetails.id, channel.id)}>
                        #{channel.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChannelList;


