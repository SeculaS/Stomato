import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import './App.css';
import PatientsList from './components/PatientsList';
import EditMedicalFile from "./components/EditMedicalFile";
import MedicalForm from "./components/MedicalForm";
import AcordPedo from "./components/AcordPedo";
import ViewPedo from "./components/ViewPedo";
import AcordEndo from "./components/AcordEndo";
import ViewEndo from "./components/ViewEndo";
import AcordChir from "./components/AcordChir";

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
              path="/acordendocreate/:cnp"
              element={loggedIn ? <AcordEndo /> : <Navigate to="/" />}
          />
          <Route
              path="/acordchircreate/:cnp"
              element={loggedIn ? <AcordChir /> : <Navigate to="/" />}
          />
          <Route
              path="/pedoview/:id"
              element={loggedIn ? <ViewPedo /> : <Navigate to="/" />}
          />
          <Route
              path="/endoview/:id"
              element={loggedIn ? <ViewEndo /> : <Navigate to="/" />}
          />
      </Routes>
    </Router>
  );
}

export default App;
