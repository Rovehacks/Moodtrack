// src/Recomendaciones.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Recomendaciones = () => {
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const usuario_id = localStorage.getItem('usuario_id');

  useEffect(() => {
    const obtenerRecomendaciones = async () => {
      try {
        const res = await axios.get(`/recomendar/${usuario_id}`);
        setRecomendaciones(res.data.recomendaciones);
      } catch (err) {
        console.error('Error al obtener recomendaciones:', err);
      } finally {
        setCargando(false);
      }
    };

    if (usuario_id) {
      obtenerRecomendaciones();
    }
  }, [usuario_id]);

  if (cargando) return <p>Cargando recomendaciones...</p>;

  return (
    <div>
      <h2>Recomendaciones personalizadas</h2>
      {recomendaciones.length > 0 ? (
        <ul>
          {recomendaciones.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      ) : (
        <p>No hay recomendaciones disponibles.</p>
      )}
    </div>
  );
};

export default Recomendaciones;
