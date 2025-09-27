// src/api.js
import axios from 'axios';

const API_URL = '';

export const login = (correo, contrasena) =>
  axios.post(`${API_URL}/auth/login`, { correo, contrasena });

export const register = (nombre, correo, contrasena) =>
  axios.post(`${API_URL}/auth/registro`, { nombre, correo, contrasena });

export const guardarRegistro = (data) =>
  axios.post(`${API_URL}/registro`, data);

export const obtenerRegistros = (usuario_id) =>
  axios.get(`${API_URL}/registros/${usuario_id}`);

export const actualizarRegistro = (id, data) =>
  axios.put(`${API_URL}/registro/${id}`, data);

export const eliminarRegistro = (id) =>
  axios.delete(`${API_URL}/registro/${id}`);

export const obtenerRecomendaciones = async (usuario_id) => {
  return await axios.get(`${API_URL}/recomendaciones/${usuario_id}`);
};  