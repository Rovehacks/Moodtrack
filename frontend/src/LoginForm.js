import React, { useState } from 'react';
import { login } from './api';

const LoginForm = ({ onLoginSuccess }) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(correo, contrasena);
      localStorage.setItem('usuario_id', res.data.id);
      onLoginSuccess();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
      <button type="submit">Entrar</button>
    </form>
  );
};

export default LoginForm;
