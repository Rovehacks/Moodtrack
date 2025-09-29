const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const authRouter = require('./routes/auth');
const registrosRouter = require('./routes/registros');
const recomendacionesRouter = require('./routes/recomendaciones');

app.use('/auth', authRouter);
app.use('/', registrosRouter); 
app.use('/recomendaciones', recomendacionesRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor principal (Node.js) corriendo en el puerto ${PORT}`);
});

