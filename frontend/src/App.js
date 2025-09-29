import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Iconos
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-300"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
);

const DumbbellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M14.4 14.4 9.6 9.6"></path><path d="M18.657 5.343a2 2 0 1 0-2.829-2.828l-1.767 1.768a2 2 0 1 0 2.829 2.828z"></path><path d="m19.07 19.07-4.484-4.484"></path><path d="m5.343 18.657a2 2 0 1 0 2.829 2.828l1.767-1.768a2 2 0 1 0-2.829-2.828z"></path><path d="m4.93 4.93 4.484 4.484"></path></svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
);


// API
const API_URL = 'http://localhost:3001';

const api = {
  request: async (endpoint, method = 'GET', body = null) => {
    const config = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) {
      config.body = JSON.stringify(body);
    }
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Error desconocido en el servidor' }));
      throw new Error(errorData.error || `Error HTTP: ${response.status}`);
    }
    
    return response.json();
  },
  login: (correo, contrasena) => api.request('/auth/login', 'POST', { correo, contrasena }),
  register: (nombre, correo, contrasena) => api.request('/auth/registro', 'POST', { nombre, correo, contrasena }),
  guardarRegistro: (data) => api.request('/registro', 'POST', data),
  obtenerRegistros: (usuario_id) => api.request(`/registros/${usuario_id}`),
  actualizarRegistro: (id, data) => api.request(`/registro/${id}`, 'PUT', data),
  eliminarRegistro: (id) => api.request(`/registro/${id}`, 'DELETE'),
  obtenerRecomendaciones: (usuario_id) => api.request(`/recomendaciones/${usuario_id}`),
};


// Subcomponentes
const AuthFormContainer = ({ children, title }) => (
  <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col justify-center items-center p-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center justify-center gap-3">
            <SunIcon /> MoodTrack <MoonIcon />
        </h1>
        <p className="text-gray-400 mt-2">Tu compañero de bienestar diario.</p>
      </div>
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-white mb-6">{title}</h2>
        {children}
      </div>
    </div>
  </div>
);

const FormInput = React.forwardRef((props, ref) => (
  <input 
    ref={ref}
    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    {...props} 
  />
));


const FormButton = ({ children, ...props }) => (
  <button 
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-500"
    {...props}
  >
    {children}
  </button>
);

const SwitchAuthButton = ({ onClick, children }) => (
    <button onClick={onClick} className="w-full mt-4 text-center text-blue-400 hover:text-blue-300">
        {children}
    </button>
);


function LoginForm({ onLoginSuccess, onSwitchToRegister }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.login(correo, contrasena);
      localStorage.setItem('usuario_id', res.id);
      onLoginSuccess(res.id);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <AuthFormContainer title="Iniciar Sesión">
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg mb-4 text-center">{error}</p>}
        <div className="mb-4">
            <FormInput type="email" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div className="mb-6">
            <FormInput type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
        </div>
        <FormButton type="submit">Entrar</FormButton>
        <SwitchAuthButton onClick={onSwitchToRegister}>
            ¿No tienes cuenta? Regístrate
        </SwitchAuthButton>
      </form>
    </AuthFormContainer>
  );
}

function RegisterForm({ onRegisterSuccess, onSwitchToLogin }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.register(nombre, correo, contrasena);
      localStorage.setItem('usuario_id', res.id);
      onRegisterSuccess(res.id);
    } catch (err) {
      setError(err.message || 'Error al registrar');
    }
  };

  return (
    <AuthFormContainer title="Crear Cuenta">
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">{error}</p>}
            <FormInput placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            <FormInput type="email" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
            <FormInput type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
            <div className="pt-2">
                <FormButton type="submit">Registrarse</FormButton>
            </div>
            <SwitchAuthButton onClick={onSwitchToLogin}>
                ¿Ya tienes cuenta? Inicia sesión
            </SwitchAuthButton>
        </form>
    </AuthFormContainer>
  );
}

function FormRegistro({ onRegistroGuardado }) {
    const getInitialState = () => ({
        sueno_horas: 8,
        gimnasio: false,
        correr: false,
        comidas: 3,
        trabajo_horas: 8,
        escuela_horas: 0,
        meditacion_min: 10,
        higiene: true,
        interaccion_social_min: 30,
        estado_animo: 5,
    });
    const [formData, setFormData] = useState(getInitialState());
    const [error, setError] = useState('');
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : Number(value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const usuario_id = localStorage.getItem('usuario_id');
            const fecha = new Date().toISOString();
            await api.guardarRegistro({ ...formData, usuario_id: Number(usuario_id), fecha });
            onRegistroGuardado();
            setFormData(getInitialState());
        } catch (error) {
            console.error('Error al guardar registro:', error);
            setError('No se pudo guardar el registro. Inténtalo de nuevo.');
        }
    };
    
    return (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Nuevo Registro del Día</h3>
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    {label: "Horas de sueño", name: "sueno_horas", type: "number", min:0, max:24},
                    {label: "Comidas realizadas", name: "comidas", type: "number", min:0, max:10},
                    {label: "Horas de trabajo", name: "trabajo_horas", type: "number", min:0, max:24},
                    {label: "Horas de escuela", name: "escuela_horas", type: "number", min:0, max:24},
                    {label: "Minutos de meditación", name: "meditacion_min", type: "number", min:0, max:120},
                    {label: "Min. interacción social", name: "interaccion_social_min", type: "number", min:0, max:1440},
                ].map(field => (
                    <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{field.label}</label>
                        <FormInput name={field.name} type={field.type} min={field.min} max={field.max} value={formData[field.name]} onChange={handleChange}/>
                    </div>
                ))}

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Estado de ánimo (1-10): {formData.estado_animo}</label>
                    <input type="range" min="1" max="10" name="estado_animo" value={formData.estado_animo} onChange={handleChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
                
                <div className="flex items-center gap-4">
                    <input type="checkbox" id="gimnasio" name="gimnasio" checked={formData.gimnasio} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"/>
                    <label htmlFor="gimnasio" className="text-gray-300">Gimnasio</label>
                </div>
                 <div className="flex items-center gap-4">
                    <input type="checkbox" id="correr" name="correr" checked={formData.correr} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"/>
                    <label htmlFor="correr" className="text-gray-300">Correr</label>
                </div>
                 <div className="flex items-center gap-4">
                     <input type="checkbox" id="higiene" name="higiene" checked={formData.higiene} onChange={handleChange} className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"/>
                    <label htmlFor="higiene" className="text-gray-300">Higiene</label>
                </div>

                <div className="md:col-span-2 mt-4">
                    <FormButton type="submit">Guardar Registro</FormButton>
                </div>
            </form>
        </div>
    );
}

// Visualización de Datos
const DashboardGraficos = ({ registros }) => {
  const moodChartRef = useRef(null);
  const habitsChartRef = useRef(null);

  useEffect(() => {
    if (!registros || registros.length === 0) return;

    const registrosOrdenados = [...registros].reverse();
    const labels = registrosOrdenados.map(r => new Date(r.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }));
    const moodData = registrosOrdenados.map(r => r.estado_animo);
    const habitsData = {
      'Gimnasio': registros.filter(r => r.gimnasio).length,
      'Correr': registros.filter(r => r.correr).length,
      'Meditación': registros.filter(r => r.meditacion_min > 0).length,
    };

    if (moodChartRef.current?.chartInstance) {
      moodChartRef.current.chartInstance.destroy();
    }
    if (habitsChartRef.current?.chartInstance) {
      habitsChartRef.current.chartInstance.destroy();
    }

    const moodCtx = moodChartRef.current.getContext('2d');
    moodChartRef.current.chartInstance = new Chart(moodCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Evolución del Estado de Ánimo',
          data: moodData,
          fill: true,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          tension: 0.3,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#e5e7eb' } } },
        scales: {
            y: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' }, min: 1, max: 10 },
            x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } }
        }
      }
    });

    const habitsCtx = habitsChartRef.current.getContext('2d');
    habitsChartRef.current.chartInstance = new Chart(habitsCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(habitsData),
        datasets: [{
          label: 'Frecuencia de Hábitos (últimos registros)',
          data: Object.values(habitsData),
          backgroundColor: ['rgba(239, 68, 68, 0.6)', 'rgba(245, 158, 11, 0.6)', 'rgba(16, 185, 129, 0.6)'],
          borderColor: ['#ef4444', '#f59e0b', '#10b981'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: { ticks: { color: '#9ca3af', stepSize: 1 }, grid: { color: '#374151' } },
            x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } }
        }
      }
    });

  }, [registros]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Tu Progreso Visual</h2>
      {registros.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold text-white mb-4">Estado de Ánimo</h3>
            <canvas ref={moodChartRef}></canvas>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold text-white mb-4">Frecuencia de Hábitos</h3>
            <canvas ref={habitsChartRef}></canvas>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center text-gray-400">
            <p>Añade más registros para ver tus gráficos de progreso.</p>
        </div>
      )}
    </div>
  );
};


// Registros
const EditModal = React.memo(({ editData, onDataChange, onUpdate, onCancel }) => (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white">Editando Registro</h3>
            <form onSubmit={(e) => { e.preventDefault(); onUpdate(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Horas de sueño</label>
                    <FormInput type="number" name="sueno_horas" min="0" value={editData.sueno_horas || ''} onChange={onDataChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Comidas realizadas</label>
                    <FormInput type="number" name="comidas" min="0" value={editData.comidas || ''} onChange={onDataChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Horas de trabajo</label>
                    <FormInput type="number" name="trabajo_horas" min="0" value={editData.trabajo_horas || ''} onChange={onDataChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Horas de escuela</label>
                    <FormInput type="number" name="escuela_horas" min="0" value={editData.escuela_horas || ''} onChange={onDataChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Minutos de meditación</label>
                    <FormInput type="number" name="meditacion_min" min="0" value={editData.meditacion_min || ''} onChange={onDataChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Min. interacción social</label>
                    <FormInput type="number" name="interaccion_social_min" min="0" value={editData.interaccion_social_min || ''} onChange={onDataChange} />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Estado de ánimo: {editData.estado_animo || 1}</label>
                    <input type="range" min="1" max="10" name="estado_animo" value={editData.estado_animo || 1} onChange={onDataChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
                <div className="flex items-center gap-4">
                    <input type="checkbox" id="edit-gimnasio" name="gimnasio" checked={!!editData.gimnasio} onChange={onDataChange} className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"/>
                    <label htmlFor="edit-gimnasio" className="text-gray-300">Gimnasio</label>
                </div>
                <div className="flex items-center gap-4">
                    <input type="checkbox" id="edit-correr" name="correr" checked={!!editData.correr} onChange={onDataChange} className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"/>
                    <label htmlFor="edit-correr" className="text-gray-300">Correr</label>
                </div>
                <div className="flex items-center gap-4">
                    <input type="checkbox" id="edit-higiene" name="higiene" checked={!!editData.higiene} onChange={onDataChange} className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"/>
                    <label htmlFor="edit-higiene" className="text-gray-300">Higiene</label>
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white">Cancelar</button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold">Guardar Cambios</button>
                </div>
            </form>
        </div>
    </div>
));

const ConfirmDeleteModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
        <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-sm text-center shadow-lg transform transition-all"
             style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <h3 className="text-xl font-bold text-white mb-4">Confirmar Eliminación</h3>
            <p className="text-gray-300 mb-6">¿Estás seguro? Esta acción no se puede deshacer.</p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors">
                    Cancelar
                </button>
                <button onClick={onConfirm} className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors">
                    Eliminar
                </button>
            </div>
        </div>
    </div>
);

const RegistroCard = React.memo(({ registro, onEdit, onDelete }) => {
    const fecha = new Date(registro.fecha).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const noNegativo = (num) => Math.max(0, num || 0);

    return (
        <div className="bg-gray-800 p-4 rounded-xl shadow-md space-y-2 transition hover:bg-gray-700/50">
            <div className="flex justify-between items-center">
                <p className="font-bold text-white">{fecha}</p>
                <div className="flex gap-2">
                    <button onClick={() => onEdit(registro)} className="text-blue-400 hover:text-blue-300"><EditIcon /></button>
                    <button onClick={() => onDelete(registro.id)} className="text-red-400 hover:text-red-300"><TrashIcon /></button>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-300 pt-2">
                <p>😴 <b>Sueño:</b> {noNegativo(registro.sueno_horas)}h</p>
                <p>🏋️ <b>Gym:</b> {registro.gimnasio ? 'Sí' : 'No'}</p>
                <p>🏃 <b>Correr:</b> {registro.correr ? 'Sí' : 'No'}</p>
                <p>🍔 <b>Comidas:</b> {noNegativo(registro.comidas)}</p>
                <p>💼 <b>Trabajo:</b> {noNegativo(registro.trabajo_horas)}h</p>
                <p>🎓 <b>Escuela:</b> {noNegativo(registro.escuela_horas)}h</p>
                <p>🧘 <b>Meditación:</b> {noNegativo(registro.meditacion_min)}m</p>
                <p>🧼 <b>Higiene:</b> {registro.higiene ? 'Sí' : 'No'}</p>
                <p>👥 <b>Social:</b> {noNegativo(registro.interaccion_social_min)}m</p>
                <p className="col-span-full">😊 <b>Ánimo:</b> <span className="font-bold text-lg text-yellow-400">{Math.max(1, registro.estado_animo || 1)}/10</span></p>
            </div>
        </div>
    );
});


function Registros({ registros, onDataChange }) {
    const [editandoId, setEditandoId] = useState(null);
    const [editData, setEditData] = useState({});
    const [registroAEliminar, setRegistroAEliminar] = useState(null);

    const handleConfirmDelete = useCallback(async () => {
        if (registroAEliminar) {
            await api.eliminarRegistro(registroAEliminar);
            onDataChange();
            setRegistroAEliminar(null);
        }
    }, [registroAEliminar, onDataChange]);

    const handleEdit = useCallback((registro) => {
        setEditandoId(registro.id);
        setEditData({ ...registro });
    }, []);
    
    const handleUpdate = useCallback(async () => {
        if (!editandoId) return;
        await api.actualizarRegistro(editandoId, editData);
        setEditandoId(null);
        onDataChange();
    }, [editandoId, editData, onDataChange]);

    const handleEditChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : Number(value)
        }));
    }, []);
    
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Tus Registros Anteriores</h2>
            {registros.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {registros.map((r) => (
                        <RegistroCard 
                            key={r.id} 
                            registro={r} 
                            onEdit={handleEdit} 
                            onDelete={setRegistroAEliminar} 
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-center bg-gray-800 p-6 rounded-xl">Aún no tienes registros. ¡Añade uno para empezar!</p>
            )}

            {editandoId && (
                <EditModal 
                    editData={editData} 
                    onDataChange={handleEditChange} 
                    onUpdate={handleUpdate} 
                    onCancel={() => setEditandoId(null)} 
                />
            )}

            {registroAEliminar && (
                <ConfirmDeleteModal 
                    onConfirm={handleConfirmDelete} 
                    onCancel={() => setRegistroAEliminar(null)} 
                />
            )}
        </div>
    );
}

// App
function App() {
  const [usuarioId, setUsuarioId] = useState(null);
  const [esRegistro, setEsRegistro] = useState(false);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const cargarDatosUsuario = useCallback(async (id) => {
      if(!id) {
          setIsLoading(false);
          return;
      };
      setIsLoading(true);
      try {
        await Promise.all([
            (async () => {
                const res = await api.obtenerRegistros(id);
                const registrosOrdenados = res.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                setRegistros(registrosOrdenados);
            })(),
            (async () => {
                const res = await api.obtenerRecomendaciones(id);
                setRecomendaciones(res.recomendaciones || []);
            })()
        ]);
      } catch(error) {
          console.error("Error al cargar datos del usuario:", error);
      } finally {
          setIsLoading(false);
      }
  }, []);


  useEffect(() => {
    const id = localStorage.getItem('usuario_id');
    setUsuarioId(id);
    cargarDatosUsuario(id);
  }, [cargarDatosUsuario]);
  
  const handleLogin = (id) => {
      setUsuarioId(id);
      cargarDatosUsuario(id);
  }

  const logout = () => {
    localStorage.removeItem('usuario_id');
    setUsuarioId(null);
    setRecomendaciones([]);
    setRegistros([]);
  };

  if (isLoading) {
      return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white text-2xl">Cargando...</div>
  }

  if (!usuarioId) {
    return esRegistro ? (
      <RegisterForm onRegisterSuccess={handleLogin} onSwitchToLogin={() => setEsRegistro(false)} />
    ) : (
      <LoginForm onLoginSuccess={handleLogin} onSwitchToRegister={() => setEsRegistro(true)} />
    );
  }
  
  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><SunIcon/> MoodTrack</h1>
          <button onClick={logout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            <LogoutIcon />
            <span>Cerrar sesión</span>
          </button>
        </nav>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <FormRegistro onRegistroGuardado={() => cargarDatosUsuario(usuarioId)} />
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2"><DumbbellIcon /> Recomendaciones</h3>
                {recomendaciones.length > 0 ? (
                    <ul className="space-y-3">
                        {recomendaciones.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
                            <span className="text-blue-400 mt-1">✨</span>
                            <span>{rec}</span>
                        </li>
                        ))}
                    </ul>
                    ) : (
                    <p className="text-gray-400">No hay recomendaciones disponibles aún. Sigue registrando tus hábitos.</p>
                )}
            </div>
        </div>

        <DashboardGraficos registros={registros} />
        <Registros registros={registros} onDataChange={() => cargarDatosUsuario(usuarioId)} />
      </main>
    </div>
  );
}

export default App;

