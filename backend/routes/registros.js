// --- routes/registros.js ---
// Rutas para Crear, Leer, Actualizar y Eliminar (CRUD) los registros diarios.

const express = require('express');
const pool = require('../db');

const router = express.Router();

// Obtener todos los registros de un usuario
router.get('/registros/:usuario_id', async (req, res, next) => {
  const { usuario_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM registros_diarios WHERE usuario_id = $1 ORDER BY fecha DESC',
      [usuario_id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Guardar un nuevo registro diario
router.post('/registro', async (req, res, next) => {
  try {
    const {
      usuario_id, fecha, sueno_horas, gimnasio, correr, comidas,
      trabajo_horas, escuela_horas, meditacion_min, higiene,
      interaccion_social_min, estado_animo
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO registros_diarios 
       (usuario_id, fecha, sueno_horas, gimnasio, correr, comidas, trabajo_horas, escuela_horas, meditacion_min, higiene, interaccion_social_min, estado_animo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [usuario_id, fecha, sueno_horas, gimnasio, correr, comidas, trabajo_horas, escuela_horas, meditacion_min, higiene, interaccion_social_min, estado_animo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Actualizar un registro por su ID
router.put('/registro/:id', async (req, res, next) => {
  const { id } = req.params;
  const {
    sueno_horas, gimnasio, correr, comidas, trabajo_horas, escuela_horas,
    meditacion_min, higiene, interaccion_social_min, estado_animo
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE registros_diarios SET 
       sueno_horas = $1, gimnasio = $2, correr = $3, comidas = $4, trabajo_horas = $5, 
       escuela_horas = $6, meditacion_min = $7, higiene = $8, interaccion_social_min = $9, 
       estado_animo = $10
       WHERE id = $11 RETURNING *`,
      [sueno_horas, gimnasio, correr, comidas, trabajo_horas, escuela_horas, meditacion_min, higiene, interaccion_social_min, estado_animo, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Registro no encontrado." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Eliminar un registro por su ID
router.delete('/registro/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM registros_diarios WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Registro no encontrado." });
    }
    res.status(204).send(); // 204 No Content es una respuesta estándar para delete exitoso
  } catch (err) {
    next(err);
  }
});

module.exports = router;

