// src/App.js
import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import FormRegistro from './FormRegistro';
import Registros from './Registros';
import { obtenerRecomendaciones } from './api'; // ⬅️ Importar API

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(false);
  const [registroActivo, setRegistroActivo] = useState(false);
  const [recomendaciones, setRecomendaciones] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem('usuario_id');
    if (id) {
      setUsuarioLogueado(true);
      cargarRecomendaciones(id);
    }
  }, []);

  const cargarRecomendaciones = async (id) => {
    try {
      const res = await obtenerRecomendaciones(id);
      setRecomendaciones(res.data.recomendaciones);
    } catch (error) {
      console.log('No se pudieron obtener recomendaciones:', error.response?.data?.error || error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('usuario_id');
    setUsuarioLogueado(false);
    setRecomendaciones([]);
  };

  return (
    <div className="App">
      <h1>MoodTrack</h1>
      {usuarioLogueado ? (
        <>
          <button onClick={logout}>Cerrar sesión</button>
          <FormRegistro />
          <Registros />
          
          {/* 🔽 Mostrar recomendaciones */}
          <div style={{ marginTop: '20px' }}>
            <h3>Recomendaciones de hábitos</h3>
            {recomendaciones.length > 0 ? (
              <ul>
                {recomendaciones.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            ) : (
              <p>No hay recomendaciones disponibles aún.</p>
            )}
          </div>
        </>
      ) : (
        <>
          {registroActivo ? (
            <RegisterForm onRegisterSuccess={() => setUsuarioLogueado(true)} />
          ) : (
            <LoginForm onLoginSuccess={() => setUsuarioLogueado(true)} />
          )}
          <button onClick={() => setRegistroActivo(!registroActivo)}>
            {registroActivo ? 'Ya tengo cuenta' : 'Crear cuenta'}
          </button>
        </>
      )}
    </div>
  );
}

export default App;
