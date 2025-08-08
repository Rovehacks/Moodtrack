// src/RegisterForm.js
import React, { useState } from 'react';
import { register } from './api';

const RegisterForm = ({ onRegisterSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(nombre, correo, contrasena);
      localStorage.setItem('usuario_id', res.data.id);
      onRegisterSuccess();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al registrar');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default RegisterForm;
