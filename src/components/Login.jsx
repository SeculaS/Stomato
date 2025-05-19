import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'medic' && password === '1234') {
      onLogin();
      navigate('/chestionar');
    } else {
      alert('Date de conectare incorecte!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Autentificare Medic</h2>

      <label>
        Utilizator:
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>

      <label>
        Parolă:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>

      <button type="submit">Login</button>
    </form>
  );
}
