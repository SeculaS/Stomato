import { useState, useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
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
import ViewChir from "./components/ViewChir";
import AcordGene from "./components/AcordGene";
import ViewGene from "./components/ViewGene";
import axios from 'axios';
const backendUrl = process.env.REACT_APP_BACKEND_URL;
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
  );
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoggedIn(false);
      return;
    }

    axios.get(`${backendUrl}/api/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
        .then(res => {
          setUser(res.data);
          setLoggedIn(true);
        })
        .catch(err => {
          console.error("Not authenticated", err);
          localStorage.removeItem("token");
          setLoggedIn(false);
        });
    if (!token) {
      setLoggedIn(false);
      window.location.href = '/';  // redirect la login
    }
  }, []);

  if (user === null && loggedIn === false) return <div>Se încarcă...</div>;
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
              path="/acordgenecreate/:cnp"
              element={loggedIn ? <AcordGene /> : <Navigate to="/" />}
          />
          <Route
              path="/pedoview/:id"
              element={loggedIn ? <ViewPedo /> : <Navigate to="/" />}
          />
          <Route
              path="/endoview/:id"
              element={loggedIn ? <ViewEndo /> : <Navigate to="/" />}
          />
          <Route
              path="/chirview/:id"
              element={loggedIn ? <ViewChir /> : <Navigate to="/" />}
          />

          <Route
              path="/geneview/:id"
              element={loggedIn ? <ViewGene /> : <Navigate to="/" />}
          />
      </Routes>
      <ToastContainer  position="top-right"
                       autoClose={3000}
                       hideProgressBar={false}
                       newestOnTop={true}
                       closeOnClick
                       pauseOnHover
                       theme="colored"
      />
    </Router>
  );
}

export default App;
