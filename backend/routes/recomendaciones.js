const express = require('express');
const pool = require('../db');
const fetch = require('node-fetch'); 

const router = express.Router();

// Servicio de Python
const PYTHON_SERVICE_URL = 'http://localhost:8000/recomendar';

router.get('/:usuario_id', async (req, res, next) => {
  const { usuario_id } = req.params;
  try {
    const registrosResult = await pool.query(
      'SELECT * FROM registros_diarios WHERE usuario_id = $1 ORDER BY fecha ASC',
      [usuario_id]
    );

    const registros = registrosResult.rows;

    const response = await fetch(PYTHON_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ registros: registros }),
    });

    if (!response.ok) {
      throw new Error(`El servicio de recomendaciones respondió con el estado: ${response.status}`);
    }

    const recomendacionesData = await response.json();
    res.json(recomendacionesData);

  } catch (err) {
    console.error("Error al contactar el servicio de Python:", err.message);
    res.status(503).json({ 
      recomendaciones: ["El servicio de recomendaciones no está disponible en este momento. Inténtalo más tarde."] 
    });
  }
});

module.exports = router;

