import React from "react";

export default function Ayman({serverDetails}) {
    // Nothing to do beforehand just displaying!
    return(
        <div>
            <header>
                <h1>Welcome to Discord Demake</h1>
            </header>
            <main>
                <div id="chat-box">
                    {serverDetails ? (
                        <>
                            <h2>{serverDetails.name}</h2>
                            <p>{serverDetails.description}</p>
                            <img src={serverDetails.image} alt={serverDetails.name} />
                        </>
                    ) : (
                        <p>Select a server to see details...</p>
                    )}
                </div>
                <input  type="text" id="message-input" placeholder="Type a message..." />
                <button id="send-button">Send</button>
            </main>
        </div>
    );
}