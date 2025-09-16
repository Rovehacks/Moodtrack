// --- routes/recomendaciones.js ---
// Esta ruta es la que conecta nuestro backend de Node.js con el servicio de Python.

const express = require('express');
const pool = require('../db');
const fetch = require('node-fetch'); // Necesitarás instalar node-fetch: npm install node-fetch@2

const router = express.Router();

// Dirección de tu servicio de Python/Flask
const PYTHON_SERVICE_URL = 'http://localhost:8000/recomendar';

router.get('/:usuario_id', async (req, res, next) => {
  const { usuario_id } = req.params;
  try {
    // 1. Obtenemos todos los registros del usuario desde nuestra base de datos
    const registrosResult = await pool.query(
      'SELECT * FROM registros_diarios WHERE usuario_id = $1 ORDER BY fecha ASC', // Orden ASC para el modelo
      [usuario_id]
    );

    const registros = registrosResult.rows;
    
    // 2. Hacemos una petición POST a nuestro servicio de Python, enviándole los registros.
    const response = await fetch(PYTHON_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ registros: registros }),
    });

    if (!response.ok) {
      // Si el servicio de Python falla, lo notificamos.
      throw new Error(`El servicio de recomendaciones respondió con el estado: ${response.status}`);
    }

    // 3. Devolvemos la respuesta del servicio de Python directamente al frontend.
    const recomendacionesData = await response.json();
    res.json(recomendacionesData);

  } catch (err) {
    // Manejo de errores, por si el servicio de Python no está disponible.
    console.error("Error al contactar el servicio de Python:", err.message);
    res.status(503).json({ 
      recomendaciones: ["El servicio de recomendaciones no está disponible en este momento. Inténtalo más tarde."] 
    });
  }
});

module.exports = router;

