import React, { useState, useEffect, useCallback, useRef, forwardRef, memo } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);


const API_URL = 'http://localhost:3001';


const SunIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500" {...props}><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
);

const DumbbellIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500" {...props}><path d="M14.4 14.4 9.6 9.6"></path><path d="M18.657 5.343a2 2 0 1 0-2.829-2.828l-1.767 1.768a2 2 0 1 0 2.829 2.828z"></path><path d="m19.07 19.07-4.484-4.484"></path><path d="m5.343 18.657a2 2 0 1 0 2.829 2.828l1.767-1.768a2 2 0 1 0-2.829-2.828z"></path><path d="m4.93 4.93 4.484 4.484"></path></svg>
);

const LogoutIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
);

const TrashIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-red-500" {...props}><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
);

const EditIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-green-500" {...props}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
);

const AlertTriangleIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500" {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);


const FireIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12.8 4.2a2.3 2.3 0 0 0-1.6 0 2.4 2.4 0 0 0-1 2.1c0 1.9 1.1 3.5 2.6 3.5s2.6-1.6 2.6-3.5a2.4 2.4 0 0 0-1-2.1z"></path>
        <path d="M10.6 8.7c-1.7 1-2.9 2.7-2.9 4.8 0 2.7 2.2 4.9 4.9 4.9s4.9-2.2 4.9-4.9c0-2.1-1.2-3.8-2.9-4.8"></path>
        <path d="M8.3 13.9c-1.1.6-1.8 1.8-1.8 3.1 0 2 1.6 3.6 3.6 3.6s3.6-1.6 3.6-3.6c0-1.3-.7-2.5-1.8-3.1"></path>
    </svg>
);

const TrophyIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 2L9 6h6l-3-4z"></path>
        <path d="M12 6v10c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V6"></path>
        <path d="M12 6v10c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V6"></path>
        <path d="M4 18h16"></path>
    </svg>
);


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
        
        const text = await response.text();
        
        if (text.length === 0) {
            return null; 
        }

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Error de parsing JSON. El servidor envió contenido no JSON en el endpoint:", endpoint, "Contenido:", text.substring(0, 100));
            throw new Error(`Error de respuesta del servidor: Contenido inválido. Revise la consola.`);
        }
    },
    login: (correo, contrasena) => api.request('/auth/login', 'POST', { correo, contrasena }),
    register: (nombre, correo, contrasena) => api.request('/auth/registro', 'POST', { nombre, correo, contrasena }),
    guardarRegistro: (data) => api.request('/registro', 'POST', data),
    obtenerRegistros: (usuario_id) => api.request(`/registros/${usuario_id}`),
    actualizarRegistro: (id, data) => api.request(`/registro/${id}`, 'PUT', data),
    eliminarRegistro: (id) => api.request(`/registro/${id}`, 'DELETE'),
    obtenerRecomendaciones: (usuario_id) => api.request(`/recomendaciones/${usuario_id}`),
    obtenerRachas: (usuario_id) => api.request(`/rachas/${usuario_id}`),
};




const AuthFormContainer = ({ children, title }) => (
    <div className="min-h-screen bg-green-50 text-gray-800 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-teal-600 flex items-center justify-center gap-3">
                    <SunIcon className="w-8 h-8"/> MoodTrack
                </h1>
                <p className="text-gray-500 mt-2 font-medium">Tu compañero de bienestar diario.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-green-200/50">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{title}</h2>
                {children}
            </div>
        </div>
    </div>
);


const FormInput = forwardRef((props, ref) => (
    <input 
        ref={ref}
        className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-400 transition"
        {...props} 
    />
));


const FormButton = ({ children, ...props }) => (
    <button 
        className="w-full bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
        {...props}
    >
        {children}
    </button>
);

const SwitchAuthButton = ({ onClick, children }) => (
    <button onClick={onClick} className="w-full mt-4 text-center text-teal-600 hover:text-teal-700 font-semibold transition-colors">
        {children}
    </button>
);


const ConfirmSubmitModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl shadow-teal-200/50 transform transition-all">
            <h3 className="text-xl font-bold text-teal-600 mb-4">✨ Confirmar Registro</h3>
            <p className="text-gray-600 mb-6">
                ¿Estás seguro/a de que has registrado <strong>información real y honesta</strong> sobre tu día? Esto garantiza la precisión de tus análisis y recomendaciones.
            </p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition-colors">
                    Revisar Datos
                </button>
                <button onClick={onConfirm} className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white font-bold transition-colors shadow-md">
                    Confirmar y Guardar
                </button>
            </div>
        </div>
    </div>
);

const SupportModal = ({ onAcknowledge }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[60] p-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md text-center shadow-2xl shadow-indigo-300/50 transform transition-all border-4 border-indigo-400">
            <AlertTriangleIcon className="w-12 h-12 mx-auto mb-4 text-orange-500" /> 
            <h3 className="text-2xl font-extrabold text-indigo-700 mb-3">¡Estamos Contigo!</h3>
            <p className="text-gray-700 mb-6 text-lg font-medium">
                Notamos que tu estado de ánimo es muy bajo. Si estás pasando por un momento difícil, recuerda que <strong>no estás solo/a</strong> y la ayuda profesional es vital.
            </p>

            <div className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-300 mb-6">
                <p className="text-lg font-extrabold text-indigo-800 mb-2">Línea de la Vida de México</p>
                <p className="text-4xl font-extrabold text-indigo-800 tracking-wide">800 911 2000</p>
                <p className="text-sm text-indigo-600 mt-1">Línea nacional de atención psicológica 24/7 (Cisac).</p>
            </div>
            
            <button onClick={onAcknowledge} className="w-full px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors shadow-md shadow-indigo-200">
                Entendido, Buscaré Apoyo
            </button>
        </div>
    </div>
);

const StreakInfo = ({ current, longest }) => (
    <div className="bg-gradient-to-r from-teal-50 to-green-50 p-5 rounded-3xl border-2 border-teal-200 mb-6 shadow-lg shadow-green-100/50">
        <h3 className="text-xl font-extrabold text-teal-600 mb-4">Tu Racha de Registros</h3>
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-white p-4 rounded-xl flex items-center gap-3 border border-gray-200 shadow-sm">
                <FireIcon className="w-8 h-8 text-orange-500" />
                <div>
                    <span className="text-3xl font-extrabold text-gray-800">{current}</span>
                    <p className="text-gray-500 font-medium">Días seguidos</p>
                </div>
            </div>
            <div className="flex-1 bg-white p-4 rounded-xl flex items-center gap-3 border border-gray-200 shadow-sm">
                <TrophyIcon className="w-8 h-8 text-yellow-600" />
                <div>
                    <span className="text-3xl font-extrabold text-gray-800">{longest}</span>
                    <p className="text-gray-500 font-medium">Racha máxima</p>
                </div>
            </div>
        </div>
    </div>
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
        <AuthFormContainer title="Bienvenido de Nuevo">
            <form onSubmit={handleSubmit}>
                {error && <p className="text-red-700 bg-red-100 p-3 rounded-lg mb-4 text-center border border-red-300">{error}</p>}
                <div className="mb-4">
                    <FormInput type="email" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                </div>
                <div className="mb-6">
                    <FormInput type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
                </div>
                <FormButton type="submit">Entrar a MoodTrack</FormButton>
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
        <AuthFormContainer title="Únete a la Comunidad">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-700 bg-red-100 p-3 rounded-lg text-center border border-red-300">{error}</p>}
                <FormInput placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                <FormInput type="email" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                <FormInput type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
                <div className="pt-2">
                    <FormButton type="submit">Crear Cuenta</FormButton>
                </div>
                <SwitchAuthButton onClick={onSwitchToLogin}>
                    ¿Ya tienes cuenta? Inicia sesión
                </SwitchAuthButton>
            </form>
        </AuthFormContainer>
    );
}

const getMoodEmoji = (score) => {
    if (score >= 9) return '🤩';
    if (score >= 7) return '😊';
    if (score >= 5) return '😐';
    if (score >= 3) return '😟';
    return '😞';
};

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
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState(null); 

    useEffect(() => {
        if (submissionMessage) {
            const timer = setTimeout(() => {
                setSubmissionMessage(null);
                setFormData(getInitialState()); 
                onRegistroGuardado(); 
            }, 1000); 
            return () => clearTimeout(timer);
        }
    }, [submissionMessage, onRegistroGuardado]); 
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : Number(value) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = async () => {
        setShowConfirmModal(false);
        setError('');
        
        try {
            const usuario_id = localStorage.getItem('usuario_id');
            const fecha = new Date().toISOString();
            await api.guardarRegistro({ ...formData, usuario_id: Number(usuario_id), fecha });
            
            if (formData.estado_animo <= 3) {
                setShowSupportModal(true);
            } 
            else {
                setSubmissionMessage('Registro guardado con éxito. ¡Sigue así!');
            }

        } catch (error) {
            console.error('Error al guardar registro:', error);
            setError('No se pudo guardar el registro. Inténtalo de nuevo.');
        }
    };
    
    const handleAcknowledgeSupport = () => {
        setShowSupportModal(false);
        setFormData(getInitialState());
        setSubmissionMessage('Registro guardado. Buscando apoyo...');
        onRegistroGuardado(); 
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-green-100/50">
            <h3 className="text-2xl font-extrabold mb-4 text-teal-600">¿Cómo te sientes hoy?</h3>
            
            {error && <p className="text-red-700 bg-red-100 p-3 rounded-lg mb-4 text-center border border-red-300">{error}</p>}
            {submissionMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded-xl mb-4 text-center font-bold transition-all duration-300">
                    {submissionMessage}
                </div>
            )}
            
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
                        <FormInput name={field.name} type={field.type} min={field.min} max={field.max} value={formData[field.name]} onChange={handleChange}/>
                    </div>
                ))}

                <div className="md:col-span-2 p-3 bg-green-50 rounded-xl border border-green-200">
                    <label className="block text-lg font-extrabold text-teal-600 mb-2">
                        {getMoodEmoji(formData.estado_animo)} Estado de ánimo (1-10): <span className="text-gray-800">{formData.estado_animo}</span>
                    </label>
                    <input 
                        type="range" min="1" max="10" name="estado_animo" 
                        value={formData.estado_animo} 
                        onChange={handleChange} 
                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-teal-500" 
                    />
                </div>
                
                <div className="flex items-center gap-4">
                    <input type="checkbox" id="gimnasio" name="gimnasio" checked={formData.gimnasio} onChange={handleChange} className="w-5 h-5 text-teal-600 bg-white border-gray-300 rounded focus:ring-teal-500"/>
                    <label htmlFor="gimnasio" className="text-gray-700 font-medium">🏋️ Gimnasio</label>
                </div>
                <div className="flex items-center gap-4">
                    <input type="checkbox" id="correr" name="correr" checked={formData.correr} onChange={handleChange} className="w-5 h-5 text-teal-600 bg-white border-gray-300 rounded focus:ring-teal-500"/>
                    <label htmlFor="correr" className="text-gray-700 font-medium">🏃 Correr</label>
                </div>
                <div className="flex items-center gap-4">
                    <input type="checkbox" id="higiene" name="higiene" checked={formData.higiene} onChange={handleChange} className="w-5 h-5 text-teal-600 bg-white border-gray-300 rounded focus:ring-teal-500"/>
                    <label htmlFor="higiene" className="text-gray-700 font-medium">🧼 Higiene Personal</label>
                </div>

                <div className="md:col-span-2 mt-4">
                    <FormButton type="submit" disabled={!!submissionMessage}>¡Registrar mi Día!</FormButton>
                </div>
            </form>

            {showConfirmModal && (
                <ConfirmSubmitModal
                    onConfirm={handleConfirmSubmit}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}
            
            {showSupportModal && (
                <SupportModal
                    onAcknowledge={handleAcknowledgeSupport}
                />
            )}
        </div>
    );
}


function DashboardGraficos({ registros }) {
    const moodChartRef = useRef(null);
    const habitsChartRef = useRef(null);

    const moodColor = 'rgba(74, 222, 128, 0.8)'; 
    const moodAreaColor = 'rgba(110, 231, 183, 0.4)'; 
    const habitColors = [
        'rgba(249, 115, 22, 0.7)',  
        'rgba(59, 130, 246, 0.7)',  
        'rgba(16, 185, 129, 0.7)',  
    ];

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
                    backgroundColor: moodAreaColor,
                    borderColor: moodColor,
                    tension: 0.4, 
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { labels: { color: '#4b5563' } } }, 
                scales: {
                    y: { 
                        ticks: { color: '#6b7280' }, 
                        grid: { color: '#e5e7eb' }, 
                        min: 1, 
                        max: 10 
                    },
                    x: { 
                        ticks: { color: '#6b7280' }, 
                        grid: { color: '#e5e7eb' } 
                    }
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
                    backgroundColor: habitColors,
                    borderColor: habitColors.map(c => c.replace('0.7', '1')),
                    borderWidth: 1,
                    borderRadius: 6, 
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { 
                        ticks: { color: '#6b7280', stepSize: 1 }, 
                        grid: { color: '#e5e7eb' } 
                    },
                    x: { 
                        ticks: { color: '#6b7280' }, 
                        grid: { color: '#e5e7eb' } 
                    }
                }
            }
        });

    }, [registros]);

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-extrabold mb-4 text-teal-600">Tu Progreso Visual</h2>
            {registros.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-green-100/50">
                        <h3 className="font-bold text-gray-800 mb-4">Evolución de tu Ánimo</h3>
                        <canvas ref={moodChartRef}></canvas>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-green-100/50">
                        <h3 className="font-bold text-gray-800 mb-4">Frecuencia de Hábitos</h3>
                        <canvas ref={habitsChartRef}></canvas>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-green-100/50 text-center text-gray-500">
                    <p className="font-medium">Añade más registros para ver tus gráficos de progreso.</p>
                </div >
            )}
        </div>
    );
}



const EditModal = memo(({ editData, onDataChange, onUpdate, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-bold text-teal-600">Editando Registro</h3>
            <form onSubmit={(e) => { e.preventDefault(); onUpdate(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    {label: "Horas de sueño", name: "sueno_horas", type: "number"},
                    {label: "Comidas realizadas", name: "comidas", type: "number"},
                    {label: "Horas de trabajo", name: "trabajo_horas", type: "number"},
                    {label: "Horas de escuela", name: "escuela_horas", type: "number"},
                    {label: "Minutos de meditación", name: "meditacion_min", type: "number"},
                    {label: "Min. interacción social", name: "interaccion_social_min", type: "number"},
                ].map(field => (
                    <div key={field.name}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
                        <FormInput 
                            type={field.type} 
                            name={field.name} 
                            min="0" 
                            value={editData[field.name] || ''} 
                            onChange={onDataChange} 
                        />
                    </div>
                ))}
                <div className="md:col-span-2 p-3 bg-green-50 rounded-xl border border-green-200">
                    <label className="block text-sm font-medium text-teal-600 mb-2">Estado de ánimo: {editData.estado_animo || 1}</label>
                    <input 
                        type="range" min="1" max="10" name="estado_animo" 
                        value={editData.estado_animo || 1} 
                        onChange={onDataChange} 
                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-teal-500" 
                    />
                </div>
                {[
                    {id: "edit-gimnasio", name: "gimnasio", label: "🏋️ Gimnasio"},
                    {id: "edit-correr", name: "correr", label: "🏃 Correr"},
                    {id: "edit-higiene", name: "higiene", label: "🧼 Higiene"},
                ].map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                        <input type="checkbox" id={item.id} name={item.name} checked={!!editData[item.name]} onChange={onDataChange} className="w-5 h-5 text-teal-600 bg-white border-gray-300 rounded focus:ring-teal-500"/>
                        <label htmlFor={item.id} className="text-gray-700">{item.label}</label>
                    </div>
                ))}

                <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition-colors">Cancelar</button>
                    <FormButton type="submit">Guardar Cambios</FormButton>
                </div>
            </form>
        </div>
    </div>
));

const ConfirmDeleteModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl shadow-red-200/50 transform transition-all">
            <h3 className="text-xl font-bold text-red-600 mb-4">🚨 Confirmar Eliminación</h3>
            <p className="text-gray-600 mb-6">¿Estás seguro? Esta acción no se puede deshacer.</p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition-colors">
                    Cancelar
                </button>
                <button onClick={onConfirm} className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-md">
                    ¡Sí, Eliminar!
                </button>
            </div>
        </div>
    </div>
);

const RegistroCard = memo(({ registro, onEdit, onDelete }) => {
    const fecha = new Date(registro.fecha).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const noNegativo = (num) => Math.max(0, num || 0);
    const moodScore = Math.max(1, registro.estado_animo || 1);

    let moodColorClass = '';
    if (moodScore >= 7) moodColorClass = 'border-green-400 bg-green-50 hover:bg-green-100';
    else if (moodScore >= 4) moodColorClass = 'border-yellow-400 bg-yellow-50 hover:bg-yellow-100';
    else moodColorClass = 'border-red-400 bg-red-50 hover:bg-red-100';

    return (
        <div className={`p-4 rounded-xl shadow-lg border-l-4 ${moodColorClass} space-y-2 transition duration-200 cursor-pointer`}>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <p className="font-extrabold text-gray-800 text-lg">{fecha}</p>
                <div className="flex gap-2">
                    <button onClick={() => onEdit(registro)} className="text-teal-600 hover:text-green-600 p-1 rounded-full hover:bg-gray-100 transition"><EditIcon className="w-5 h-5"/></button>
                    <button onClick={() => onDelete(registro.id)} className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-gray-100 transition"><TrashIcon className="w-5 h-5"/></button>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-700 pt-2">
                <p>😴 <b>Sueño:</b> {noNegativo(registro.sueno_horas)}h</p>
                <p>🏋️ <b>Gym:</b> {registro.gimnasio ? 'Sí' : 'No'}</p>
                <p>🏃 <b>Correr:</b> {registro.correr ? 'Sí' : 'No'}</p>
                <p>🍔 <b>Comidas:</b> {noNegativo(registro.comidas)}</p>
                <p>💼 <b>Trabajo:</b> {noNegativo(registro.trabajo_horas)}h</p>
                <p>🎓 <b>Escuela:</b> {noNegativo(registro.escuela_horas)}h</p>
                <p>🧘 <b>Meditación:</b> {noNegativo(registro.meditacion_min)}m</p>
                <p>🧼 <b>Higiene:</b> {registro.higiene ? 'Sí' : 'No'}</p>
                <p>👥 <b>Social:</b> {noNegativo(registro.interaccion_social_min)}m</p>
                <p className="col-span-full">
                    ❤️ <b>Ánimo:</b> 
                    <span className={`font-bold text-xl ml-2 p-1 rounded-lg ${moodScore >= 7 ? 'text-green-700' : moodScore >= 4 ? 'text-yellow-700' : 'text-red-700'}`}>
                        {moodScore}/10
                    </span>
                </p>
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
            <h2 className="text-2xl font-extrabold mb-4 text-teal-600">Tus Registros Anteriores</h2>
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
                <p className="text-gray-500 text-center bg-white p-6 rounded-xl shadow-lg font-medium">Aún no tienes registros. ¡Añade uno para empezar!</p>
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

function App() {
    const [usuarioId, setUsuarioId] = useState(null);
    const [esRegistro, setEsRegistro] = useState(false);
    const [recomendaciones, setRecomendaciones] = useState([]);
    const [registros, setRegistros] = useState([]);
    const [racha, setRacha] = useState({ current_streak: 0, longest_streak: 0 });
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
                    const data = res || []; 
                    const registrosOrdenados = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                    setRegistros(registrosOrdenados);
                })(),
                (async () => {
                    const res = await api.obtenerRecomendaciones(id);
                    const data = res || {}; 
                    setRecomendaciones(data.recomendaciones || []);
                })(),
                (async () => {
                    const res = await api.obtenerRachas(id);
                    setRacha(res || { current_streak: 0, longest_streak: 0 });
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
        setRacha({ current_streak: 0, longest_streak: 0 });
    };

    if (isLoading) {
        return <div className="bg-green-50 min-h-screen flex items-center justify-center text-teal-600 text-2xl font-bold">Cargando...</div>
    }

    if (!usuarioId) {
        return esRegistro ? (
            <RegisterForm onRegisterSuccess={handleLogin} onSwitchToLogin={() => setEsRegistro(false)} />
        ) : (
            <LoginForm onLoginSuccess={handleLogin} onSwitchToRegister={() => setEsRegistro(true)} />
        );
    }
    
    return (
        <div className="bg-green-50 min-h-screen text-gray-800 font-sans">
            <header className="bg-white/90 backdrop-blur-md sticky top-0 z-10 shadow-md">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
                    <h1 className="text-2xl font-extrabold text-teal-600 flex items-center gap-2">
                        <SunIcon className="w-6 h-6"/> MoodTrack
                    </h1>
                    <button onClick={logout} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors shadow-sm">
                        <LogoutIcon className="w-5 h-5"/>
                        <span>Cerrar sesión</span>
                    </button>
                </nav>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <FormRegistro onRegistroGuardado={() => cargarDatosUsuario(usuarioId)} />
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-green-100/50">
                        
                        <StreakInfo current={racha.current_streak} longest={racha.longest_streak} />

                        <h3 className="text-2xl font-extrabold mb-4 text-teal-600 flex items-center gap-2">
                            <DumbbellIcon /> Recomendaciones
                        </h3>
                        {recomendaciones.length > 0 ? (
                            <ul className="space-y-3">
                                {recomendaciones.map((rec, i) => (
                                <li key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                                    <span className="text-teal-600 font-extrabold mt-1">✨</span>
                                    <span className="text-gray-700">{rec}</span>
                                </li>
                                ))}
                            </ul>
                            ) : (
                            <p className="text-gray-500 font-medium">No hay recomendaciones disponibles aún. Sigue registrando tus hábitos.</p>
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
