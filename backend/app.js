// --- index.js ---
// Este es el archivo principal. Su única responsabilidad ahora es
// configurar el servidor y conectar los diferentes módulos de rutas.

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// --- Configuración de la App ---
const app = express();
app.use(cors());
app.use(express.json());

// --- Rutas Modulares ---
// Importamos y usamos las rutas desde archivos separados para mantener el código limpio.
const authRouter = require('./routes/auth');
const registrosRouter = require('./routes/registros');
const recomendacionesRouter = require('./routes/recomendaciones');

app.use('/auth', authRouter);
app.use('/', registrosRouter); // Rutas como /registro, /registros/:id, etc.
app.use('/recomendaciones', recomendacionesRouter);

// --- Manejo de Errores Centralizado (Opcional pero recomendado) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor.' });
});


// --- Iniciar Servidor ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor principal (Node.js) corriendo en el puerto ${PORT}`);
});

