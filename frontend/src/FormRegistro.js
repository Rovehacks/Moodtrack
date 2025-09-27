import React, { useState } from 'react';
import axios from 'axios';

const FormRegistro = () => {
  const [formData, setFormData] = useState({
    usuario_id: 1,
    fecha: '',
    sueno_horas: 0,
    gimnasio: false,
    correr: false,
    comidas: 0,
    trabajo_horas: 0,
    escuela_horas: 0,
    meditacion_min: 0,
    higiene: false,
    interaccion_social_min: 0,
    estado_animo: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Obtener usuario_id desde localStorage
  const usuario_id = localStorage.getItem('usuario_id');

  if (!usuario_id) {
    alert('Debes iniciar sesión antes de registrar hábitos.');
    return;
  }

  try {
    // Agregar el usuario_id al formData antes de enviarlo
    const datosAEnviar = { ...formData, usuario_id };

    await axios.post('/registro', datosAEnviar);
    alert('Registro guardado con éxito');
  } catch (error) {
    console.error(error);
    alert('Error al guardar');
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro de hábitos diarios</h2>
      <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
      <input type="number" name="sueno_horas" placeholder="Horas de sueño" value={formData.sueno_horas} onChange={handleChange} />
      <label><input type="checkbox" name="gimnasio" checked={formData.gimnasio} onChange={handleChange} /> Gimnasio</label>
      <label><input type="checkbox" name="correr" checked={formData.correr} onChange={handleChange} /> Correr</label>
      <input type="number" name="comidas" placeholder="Comidas al día" value={formData.comidas} onChange={handleChange} />
      <input type="number" name="trabajo_horas" placeholder="Horas de trabajo" value={formData.trabajo_horas} onChange={handleChange} />
      <input type="number" name="escuela_horas" placeholder="Horas de escuela" value={formData.escuela_horas} onChange={handleChange} />
      <input type="number" name="meditacion_min" placeholder="Minutos de meditación" value={formData.meditacion_min} onChange={handleChange} />
      <label><input type="checkbox" name="higiene" checked={formData.higiene} onChange={handleChange} /> Higiene personal</label>
      <input type="number" name="interaccion_social_min" placeholder="Minutos de interacción social" value={formData.interaccion_social_min} onChange={handleChange} />
      <select name="estado_animo" value={formData.estado_animo} onChange={handleChange}>
        <option value={2}>😀 Muy bien</option>
        <option value={1}>🙂 Bien</option>
        <option value={0}>😐 Normal</option>
        <option value={-1}>🙁 Mal</option>
        <option value={-2}>😞 Muy mal</option>
      </select>
      <button type="submit">Guardar</button>
    </form>
  );
};

export default FormRegistro;
