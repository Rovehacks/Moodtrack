// backend/routes/recomendaciones.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const pool = require('../db');

// Obtener registros del usuario y solicitar recomendaciones
router.get('/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM registros_diarios WHERE usuario_id = $1 ORDER BY fecha DESC LIMIT 10`,
      [usuario_id]
    );

    const registrosCompletos = result.rows;

    if (registrosCompletos.length < 5) {
      return res.json({ recomendaciones: [] });
    }

    // Solo enviar las columnas que el modelo espera
    const registros = registrosCompletos.map(reg => ({
      sueno_horas: reg.sueno_horas,
      gimnasio: reg.gimnasio,
      correr: reg.correr,
      comidas: reg.comidas,
      trabajo_horas: reg.trabajo_horas,
      escuela_horas: reg.escuela_horas,
      meditacion_min: reg.meditacion_min,
      higiene: reg.higiene,
      interaccion_social_min: reg.interaccion_social_min,
      estado_animo: reg.estado_animo
    }));

    const response = await axios.post('http://localhost:8000/recomendar', {
      registros
    });

    const recomendaciones = response.data.recomendaciones;
    res.json({ recomendaciones });

  } catch (error) {
    console.error('Error al obtener recomendaciones:', error.message);
    res.status(500).json({ error: 'Error al generar recomendaciones' });
  }
});

module.exports = router;
