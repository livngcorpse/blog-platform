import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import SinglePost from './pages/SinglePost';

// Styles
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} />
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={<Home currentUser={user} />} 
            />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" /> : <Login />} 
            />
            <Route 
              path="/create-post" 
              element={<CreatePost currentUser={user} />} 
            />
            <Route 
              path="/edit-post/:id" 
              element={<EditPost currentUser={user} />} 
            />
            <Route 
              path="/post/:id" 
              element={<SinglePost currentUser={user} />} 
            />
            <Route 
              path="*" 
              element={<div className="not-found">Page not found</div>} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;