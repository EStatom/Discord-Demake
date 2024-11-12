const sidebarStyles = {
  sidebar: {
    height: '100%',
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
    alignItems: 'center',
    backgroundColor: '#202225',
    borderLeft: '3px solid transparent',
    transition: 'border-left 0.2s ease, border-radius 0.2s ease',
  },
  iconContainerHover: {
    marginBottom: '15px',
    width: '70px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202225',
    borderLeft: '3px solid white',
    transition: 'border-left 0.2s ease, border-radius 0.2s ease',
  },
  iconContainerActive: {
    marginBottom: '15px',
    width: '70px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'border-left 0.2s ease, border-radius 0.2s ease',
    borderLeft: '3px solid #5865F2',
    backgroundColor: '#2F3136',
  },
  serverIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    transition: 'border-radius 0.2s ease',
  },
  serverIconHover: {
    width: '50px',
    height: '50px',
    borderRadius: '30%',
    transition: 'border-radius 0.2s ease',
  },
  icon: {
    fontSize: '24px',
    color: 'white',
  },
  popup: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.90)', // Darker dimmed background overlay
    zIndex: '1000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContent: {
    backgroundColor: '#2f3136', // Unified dark gray background
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Soft box shadow for depth
    width: '300px',
    color: 'white', // Text color for all content inside popups
    fontFamily: 'Arial, sans-serif', // Consistent font across components
  },
  input: {
    width: '90%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#202225', // Input background color
    color: 'white', // Text color for inputs
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '10px',
    alignItems: 'center',
  },
  submitButton: {
    width: '100%', 
    padding: '0 15px',
    backgroundColor: '#7289da', // Blue button for primary actions
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    margin: 0,
    height: '40px',
  },
  closeButton: {
    width: '100%', 
    padding: '0 15px',
    backgroundColor: '#dc3545', // Red button for destructive actions
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    margin: 0,
    justifyContent: 'center',
    boxSizing: 'border-box',
    height: '40px',
  },
};

export default sidebarStyles;
