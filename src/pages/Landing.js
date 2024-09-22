import React from "react";
import './Landing.css';
import logo from './logo.svg';

export default function Landing() {
    return(
        <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Discord Demake
          </p>
        </header>
      </div>
    );
}