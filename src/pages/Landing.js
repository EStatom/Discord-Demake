import React from "react";
import './Landing.css';
import logo from './logo.svg';

export default function Landing() {
    return(
        <div style = {{ width: '100%'}} className="App">
          <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Discord Demake
          </p>
          </div>
      </div>
    );
}