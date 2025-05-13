import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MedicalForm from './components/MedicalForm';
import Login from './components/Login';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={loggedIn ? <Navigate to="/chestionar" /> : <Login onLogin={() => setLoggedIn(true)} />}
        />
        <Route
          path="/chestionar"
          element={loggedIn ? <MedicalForm /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
