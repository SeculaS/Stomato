import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import './App.css';
import PatientsList from './components/PatientsList';
import EditMedicalFile from "./components/EditMedicalFile";
import MedicalForm from "./components/MedicalForm";
import AcordPedo from "./components/AcordPedo";
import ViewPedo from "./components/ViewPedo";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={loggedIn ? <Navigate to="/patienti" /> : <Login onLogin={() => setLoggedIn(true)} />}
        />
        <Route
          path="/patienti"
          element={loggedIn ? <PatientsList /> : <Navigate to="/" />}
        />

          <Route
              path="/chestionar"
              element={loggedIn ? <MedicalForm /> : <Navigate to="/" />}
          />
          <Route
              path="/edit/:cnp"
              element={loggedIn ? <EditMedicalFile /> : <Navigate to="/" />}
          />
          <Route
              path="/acordpedocreate/:cnp"
              element={loggedIn ? <AcordPedo /> : <Navigate to="/" />}
          />
          <Route
            path="/pedoview/:id"
            element={loggedIn ? <ViewPedo /> : <Navigate to="/" />}
          />
      </Routes>
    </Router>
  );
}

export default App;
