const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db'); 

const router = express.Router();

// Registro de usuario
router.post('/registro', async (req, res, next) => {
  const { nombre, correo, contrasena } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const nuevoUsuario = await pool.query(
      `INSERT INTO usuarios (nombre, correo, contrasena) VALUES ($1, $2, $3) RETURNING id, nombre, correo`,
      [nombre, correo, hashedPassword]
    );
    res.status(201).json(nuevoUsuario.rows[0]);
  } catch (err) {
    if (err.code === '23505') { 
      return res.status(400).json({ error: 'El correo ya está registrado.' });
    }
    next(err); 
  }
});

// Iniciar sesión
router.post('/login', async (req, res, next) => {
  const { correo, contrasena } = req.body;
  try {
    const result = await pool.query(`SELECT * FROM usuarios WHERE correo = $1`, [correo]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Credenciales incorrectas.' });
    }

    const usuario = result.rows[0];
    const match = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!match) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    res.json({ id: usuario.id, nombre: usuario.nombre });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

