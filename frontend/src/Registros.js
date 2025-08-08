import React, { useEffect, useState } from 'react';
import { obtenerRegistros, eliminarRegistro, actualizarRegistro } from './api';

const Registros = () => {
  const usuario_id = localStorage.getItem('usuario_id');
  const [registros, setRegistros] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({});

  const cargarRegistros = async () => {
    const res = await obtenerRegistros(usuario_id);
    setRegistros(res.data);
  };

  useEffect(() => {
    cargarRegistros();
  }, []);

  const handleDelete = async (id) => {
    await eliminarRegistro(id);
    cargarRegistros();
  };

  const handleEdit = (registro) => {
    setEditandoId(registro.id);
    setEditData({ ...registro });
  };

  const handleUpdate = async () => {
    await actualizarRegistro(editandoId, editData);
    setEditandoId(null);
    cargarRegistros();
  };

  const handleChange = (campo, valor) => {
    setEditData({ ...editData, [campo]: valor });
  };

  return (
    <div>
      <h2>Tus registros</h2>
      {registros.map((r) =>
        editandoId === r.id ? (
          <div key={r.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <p><b>Fecha:</b> {r.fecha}</p>
            <label>Horas de sueño:</label>
            <input type="number" value={editData.sueno_horas} onChange={(e) => handleChange('sueno_horas', e.target.value)} />
            <label>Gimnasio:</label>
            <input type="checkbox" checked={editData.gimnasio} onChange={(e) => handleChange('gimnasio', e.target.checked)} />
            <label>Correr:</label>
            <input type="checkbox" checked={editData.correr} onChange={(e) => handleChange('correr', e.target.checked)} />
            <label>Comidas:</label>
            <input type="number" value={editData.comidas} onChange={(e) => handleChange('comidas', e.target.value)} />
            <label>Horas de trabajo:</label>
            <input type="number" value={editData.trabajo_horas} onChange={(e) => handleChange('trabajo_horas', e.target.value)} />
            <label>Horas de escuela:</label>
            <input type="number" value={editData.escuela_horas} onChange={(e) => handleChange('escuela_horas', e.target.value)} />
            <label>Min. meditación:</label>
            <input type="number" value={editData.meditacion_min} onChange={(e) => handleChange('meditacion_min', e.target.value)} />
            <label>Higiene:</label>
            <input type="checkbox" checked={editData.higiene} onChange={(e) => handleChange('higiene', e.target.checked)} />
            <label>Min. interacción social:</label>
            <input type="number" value={editData.interaccion_social_min} onChange={(e) => handleChange('interaccion_social_min', e.target.value)} />
            <label>Estado de ánimo:</label>
            <input type="number" value={editData.estado_animo} onChange={(e) => handleChange('estado_animo', e.target.value)} />
            <br />
            <button onClick={handleUpdate}>Guardar</button>
            <button onClick={() => setEditandoId(null)}>Cancelar</button>
          </div>
        ) : (
          <div key={r.id} style={{ border: '1px solid #eee', margin: '10px', padding: '10px' }}>
            <p><b>Fecha:</b> {r.fecha}</p>
            <p><b>Sueño:</b> {r.sueno_horas} horas</p>
            <p><b>Gimnasio:</b> {r.gimnasio ? 'Sí' : 'No'}</p>
            <p><b>Correr:</b> {r.correr ? 'Sí' : 'No'}</p>
            <p><b>Comidas:</b> {r.comidas}</p>
            <p><b>Trabajo:</b> {r.trabajo_horas} horas</p>
            <p><b>Escuela:</b> {r.escuela_horas} horas</p>
            <p><b>Meditación:</b> {r.meditacion_min} min</p>
            <p><b>Higiene:</b> {r.higiene ? 'Sí' : 'No'}</p>
            <p><b>Interacción social:</b> {r.interaccion_social_min} min</p>
            <p><b>Estado de ánimo:</b> {r.estado_animo}</p>
            <button onClick={() => handleEdit(r)}>Editar</button>
            <button onClick={() => handleDelete(r.id)}>Eliminar</button>
          </div>
        )
      )}
    </div>
  );
};

export default Registros;
