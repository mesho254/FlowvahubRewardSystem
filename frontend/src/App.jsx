import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, CircularProgress } from '@mui/material';
import { AuthContext } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Rewards from './pages/Rewards.jsx';
import Confirm from './pages/Confirm.jsx';
import Settings from './pages/Settings.jsx';  // New

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <CircularProgress style={{ color: 'white', margin: 'auto', display: 'block', marginTop: '20%' }} />;

  return (
    <Container maxWidth="md" style={{ padding: '20px' }}>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        <Route path="/auth/confirm" element={<Confirm />} />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
        <Route path="/" element={user ? <Rewards /> : <Navigate to="/login" />} />
      </Routes>
    </Container>
  );
}

export default App;