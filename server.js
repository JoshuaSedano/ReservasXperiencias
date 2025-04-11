require('dotenv').config();
const express = require('express');
const path = require('path');
// Importa fetch (node-fetch v3 se importa así en Node 18+)
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------
// MIDDLEWARE
// ------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Si NO usas autenticación ni login, puedes quitar session y el middleware requireAuth:
// const session = require('express-session');
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'secret',
//   resave: false,
//   saveUninitialized: false
// }));

// ------------------
// RUTAS PARA TUS HTML
// ------------------

// Ruta principal, por si quieres que abra experiencias.html en la raíz "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'experiencias.html'));
});

// Ruta que sirve tu archivo experiencias.html
app.get('/experiencias', (req, res) => {
  res.sendFile(path.join(__dirname, 'experiencias.html'));
});

// Ruta que sirve tu archivo salas.html
app.get('/salas', (req, res) => {
  res.sendFile(path.join(__dirname, 'salas.html'));
});

// ------------------
// RUTA PARA GUARDAR DATOS EN SHEETDB
// ------------------
// En este ejemplo, la llamamos "/reservar-experiencia"
app.post('/reservar-experiencia', async (req, res) => {
  try {
    // Aquí envías los datos a SheetDB para la hoja "Experiencias"
    const response = await fetch('https://sheetdb.io/api/v1/td4sbrvtrviyp?sheet=Experiencias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data); // Devolvemos el resultado al cliente
  } catch (error) {
    console.error('Error al enviar datos a SheetDB:', error);
    res.status(500).json({ error: 'Error creando la reserva de experiencia' });
  }
});

// ------------------
// SERVIR ARCHIVOS ESTÁTICOS
// ------------------
// Esto sirve todos los archivos de la carpeta donde está tu server.js (css, js, imgs, etc.)
app.use(express.static(path.join(__dirname)));

// ------------------
// INICIAR SERVIDOR
// ------------------
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
