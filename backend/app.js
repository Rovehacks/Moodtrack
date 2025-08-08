const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const recomendacionesRouter = require('./routes/recomendaciones');
app.use('/recomendaciones', recomendacionesRouter);


//Registro usuario
app.post('/auth/registro', async (req, res) => {
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
      res.status(400).json({ error: 'El correo ya está registrado.' });
    } else {
      console.error(err.message);
      res.status(500).json({ error: 'Error al registrar usuario.' });
    }
  }
});

//Iniciar sesión
app.post('/auth/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM usuarios WHERE correo = $1`,
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Correo no encontrado.' });
    }

    const usuario = result.rows[0];
    const match = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    // Por simplicidad, devolvemos el id para usarlo en los registros
    res.json({ id: usuario.id, nombre: usuario.nombre });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
});



// Guardar registro diario
app.post('/registro', async (req, res) => {
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

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al guardar registro");
  }
});

// Obtener recomendaciones
app.get('/recomendaciones/:usuario_id', async (req, res) => {
  try {
    const usuario_id = req.params.usuario_id;
    const registros = await pool.query(
      `SELECT * FROM registros_diarios WHERE usuario_id = $1 ORDER BY fecha DESC LIMIT 7`,
      [usuario_id]
    );

    let recomendaciones = [];

    if (registros.rows.length === 0) {
      recomendaciones.push("Registra tus hábitos para recibir recomendaciones.");
    } else {
      const datos = registros.rows;
      const prom = (campo) =>
        datos.reduce((a, r) => a + (r[campo] || 0), 0) / datos.length;

      if (prom("sueno_horas") < 6) recomendaciones.push("Duerme al menos 7 horas.");
      if (prom("meditacion_min") < 5) recomendaciones.push("Medita al menos 5 minutos.");
      if (prom("interaccion_social_min") < 30) recomendaciones.push("Dedica más tiempo a interactuar con otros.");
    }

    res.json({ recomendaciones });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al obtener recomendaciones");
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor en puerto ${process.env.PORT}`);
});

// Obtener todos los registros de un usuario
app.get('/registros/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM registros_diarios WHERE usuario_id = $1 ORDER BY fecha DESC',
      [usuario_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error detallado:', err);  // 👈 esto mostrará el error real
    res.status(500).json({ error: 'Error al actualizar registro', detalle: err.message });
  }
});

// Actualizar un registro por ID
app.put('/registro/:id', async (req, res) => {
  const { id } = req.params;
  const {
    sueno_horas, gimnasio, correr, comidas,
    trabajo_horas, escuela_horas, meditacion_min,
    higiene, interaccion_social_min, estado_animo
  } = req.body;

  try {
    await pool.query(
      `UPDATE registros_diarios SET 
        sueno_horas = $1,
        gimnasio = $2,
        correr = $3,
        comidas = $4,
        trabajo_horas = $5,
        escuela_horas = $6,
        meditacion_min = $7,
        higiene = $8,
        interaccion_social_min = $9,
        estado_animo = $10
      WHERE id = $11`,
      [
        sueno_horas,
        gimnasio,
        correr,
        comidas,
        trabajo_horas,
        escuela_horas,
        meditacion_min,
        higiene,
        interaccion_social_min,
        estado_animo,
        id
      ]
    );
    res.json({ mensaje: 'Registro actualizado correctamente' });
  } catch (err) {
    console.error('Error detallado:', err);
    res.status(500).json({ error: 'Error al actualizar registro', detalle: err.message });
  }
});


// Eliminar un registro por ID
app.delete('/registro/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM registros_diarios WHERE id = $1', [id]);
    res.json({ mensaje: 'Registro eliminado correctamente' });
  } catch (err) {
    console.error('Error detallado:', err);  // 👈 esto mostrará el error real
    res.status(500).json({ error: 'Error al actualizar registro', detalle: err.message });
  }
});

