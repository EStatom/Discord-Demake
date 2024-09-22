import React from "react";

export default function Ayman() {
    return(
        <html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    
    <title>Discord Demake</title>
    

    <link rel="stylesheet" href="styles.css"/>
</head>
<body>

    <header>
        <h1>Welcome to Discord Demake</h1>
    </header>
    

    <main>

        <div id="chat-box">
            <p>Chat messages will appear here...</p> 
        </div>
        

        <input type="text" id="message-input" placeholder="Type a message..."/>
        

        <button id="send-button">Send</button>
    </main>
    

    <script src="script.js"></script>
</body>
</html>
    );
}