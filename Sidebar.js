// Sidebar.js
import React, { useState } from 'react';
import './Sidebar.css'; // Create a separate CSS file to include the styles

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getAuth , createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3ZULRt9mb_Mm3zgN7fd-6ADlxRMTXieg",
  authDomain: "discord-demake-ae307.firebaseapp.com",
  databaseURL: "https://discord-demake-ae307-default-rtdb.firebaseio.com",
  projectId: "discord-demake-ae307",
  storageBucket: "discord-demake-ae307.appspot.com",
  messagingSenderId: "945803825134",
  appId: "1:945803825134:web:807196abce2f51adb048ff",
  measurementId: "G-9HYH03RYHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const server1Ref = ref(storage, 'images/Capture 2.png')
getDownloadURL(server1Ref).then((url) => {
  const img = document.getElementById('img1');
  img.setAttribute('src', url);

});
const server2Ref = ref(storage, 'images/Capture.PNG')
getDownloadURL(server2Ref).then((url) => {
  const img = document.getElementById('img2');
  img.setAttribute('src', url);

});

//The previous CSS styling in JSX.  Can be moved to a seperate document if desired.
const styles = {
  sidebar: {
    minHeight: '100vh',
    width: '70px',
    backgroundColor: '#202225',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
  },
  iconContainer: {
    marginBottom: '15px',
    width: '70px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#202225',
    borderStyle: 'transparent',
  },
  iconContainerHover: {
    marginBottom: '15px',
    paddingLeft: '5px',
    borderLeft: 'solid 3px',
    borderLeftColor: 'white',
  },
  serverIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
  },
  serverIconHover: {
    width: '50px',
    height: '50px',
    borderRadius: '30%',
  },
  serverIconActive: {
    width: '50px',
    height: '50px',
    borderRadius: '30%',
  },
  popup: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '300px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  submitButton: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  closeButton: {
    padding: '10px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};


function Sidebar() {

//Adding a variable to set a button to "clicked" and change the style.  Clicking one disables the others.
  const [isClicked1, setIsClicked1] = useState(false);

  const handleButtonClick1 = () => {
    setIsClicked1(true);
    setIsClicked2(false);
    setIsClicked3(false);
    setIsClicked4(false); 
    setIsClicked5(false); 
  };
  
  const [isClicked2, setIsClicked2] = useState(false);

  const handleButtonClick2 = () => {
    setIsClicked1(false);
    setIsClicked2(true);
    setIsClicked3(false);
    setIsClicked4(false);  
    setIsClicked5(false); 
  };

  const [isClicked3, setIsClicked3] = useState(false);

  const handleButtonClick3 = () => {
    setIsClicked1(false);
    setIsClicked2(false);
    setIsClicked3(true);
    setIsClicked4(false); 
    setIsClicked5(false); 
  };

  const [isClicked4, setIsClicked4] = useState(false);

  const handleButtonClick4 = () => {
    setIsClicked1(false);
    setIsClicked2(false);
    setIsClicked3(false);
    setIsClicked4(true);
    setIsClicked5(false);  
  };

  const [isClicked5, setIsClicked5] = useState(false);

  const handleButtonClick5 = () => {
    setIsClicked1(false);
    setIsClicked2(false);
    setIsClicked3(false);
    setIsClicked4(false);
    setIsClicked5(true); 
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [inputOne, setInputOne] = useState('');
  const [inputTwo, setInputTwo] = useState('');

  const handleButtonClicka = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setInputOne(''); // Clear input on close
    setInputTwo(''); // Clear input on close
  };

  const handleInputOneChange = (e) => {
    setInputOne(e.target.value);
  };

  const handleInputTwoChange = (e) => {
    setInputTwo(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, inputOne, inputTwo)
      .then((userCredential) => {
        const userId = userCredential.user.uid;
        const userData = {inputOne};
        setDoc(doc(db, "users", userId), {userData});
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    handleClosePopup();
  };

  //Adding a variable to change a components style on mouseover.
  const [isHovering1, setIsHovering1] = useState(false);
  const [isHovering2, setIsHovering2] = useState(false);
  const [isHovering3, setIsHovering3] = useState(false);
  const [isHovering4, setIsHovering4] = useState(false);
  const [isHovering5, setIsHovering5] = useState(false);

  return (
    <div style={styles.sidebar}>    
      <div onMouseEnter={() => setIsHovering1(true)} onMouseLeave={() => setIsHovering1(false)} style={isClicked1 || isHovering1 ? styles.iconContainerHover : styles.iconContainer}>
      <button style={isClicked1 ? styles.serverIconHover : styles.serverIcon} onClick={handleButtonClick1}>
        <img id="img1" alt="Server Icon" style={isClicked1 ? styles.serverIconHover : styles.serverIcon} />
      </button>
      </div>
      <div onMouseEnter={() => setIsHovering2(true)} onMouseLeave={() => setIsHovering2(false)} style={isClicked2 || isHovering2 ? styles.iconContainerHover : styles.iconContainer}>
      <button style={isClicked2 ? styles.serverIconHover : styles.serverIcon} onClick={handleButtonClick2}>
        <img id="img2" alt="Server Icon" style={isClicked2 ? styles.serverIconHover : styles.serverIcon} />
      </button>
      </div>
      <div onMouseEnter={() => setIsHovering3(true)} onMouseLeave={() => setIsHovering3(false)} style={isClicked3 || isHovering3 ? styles.iconContainerHover : styles.iconContainer}>
      <button style={isClicked3 ? styles.serverIconHover : styles.serverIcon} onClick={handleButtonClick3}>
        <img src="https://unsplash.it/600/400?image=147" alt="Server Icon" style={isClicked3 ? styles.serverIconHover : styles.serverIcon} />
      </button>
      </div>
      <div onMouseEnter={() => setIsHovering4(true)} onMouseLeave={() => setIsHovering4(false)} style={isClicked4 || isHovering4 ? styles.iconContainerHover : styles.iconContainer}>
      <button style={isClicked4 ? styles.serverIconHover : styles.serverIcon} onClick={handleButtonClick4}>
        <img src="https://unsplash.it/600/400?image=163" alt="Server Icon" style={isClicked4 ? styles.serverIconHover : styles.serverIcon} />
      </button>
      </div>
      {/* Add more icons as needed */}
      <div onMouseEnter={() => setIsHovering5(true)} onMouseLeave={() => setIsHovering5(false)} style={isHovering5 ? styles.iconContainerHover : styles.iconContainer}> 
        <button style={styles.serverIcon} onClick={handleButtonClicka}> 
        <span style={styles.icon}>➕</span> 
        </button>
      </div>
      {isPopupVisible && (
        <div style={styles.popup}>
          <div style={styles.popupContent}>
            <h2>Enter Your Text</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputOne}
                onChange={handleInputOneChange}
                style={styles.input}
                placeholder="email"
              />
              <input
                type="text"
                value={inputTwo}
                onChange={handleInputTwoChange}
                style={styles.input}
                placeholder="password"
              />
              <div style={styles.buttonContainer}>
                <button type="submit" style={styles.submitButton}>
                  Submit
                </button>
                <button type="button" style={styles.closeButton} onClick={handleClosePopup}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}; 
    </div>
  );
  
};

export default Sidebar;

