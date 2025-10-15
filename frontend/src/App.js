import React, { useState } from 'react';
import './styles.css';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(true);

  const handleLogin = (loggedInUser) => setUser(loggedInUser);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShowRegister(true);
  };

  return (
    <div className="app-container">
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '30px', 
        backgroundColor: '#007bff', 
        width: '100%',
        display:'flex',
        flexDirection:'column',
        padding: '35px', 
        borderRadius: '8px' ,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#ffffff', margin: 0 }}>Primetrade.ai</h1>
        <p style={{ color: '#ffffff', margin: 0 }}>Welcome to the Primetrade Dashboard</p>
      </header>

      {!user ? (
        <>
          {showRegister ? <Register /> : <Login onLogin={handleLogin} />}
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            {showRegister ? (
              <p>
                Already have an account?{' '}
                <button onClick={() => setShowRegister(false)}>Login</button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setShowRegister(true)}>Register</button>
              </p>
            )}
          </div>
        </>
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
