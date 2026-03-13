const express = require('express');
const path = require('path'); // ¡Importante tener esta línea!
const app = express();

app.use(express.json());

// Esta línea es la CLAVE: usa __dirname para que no importe desde dónde abras la terminal
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ... tus rutas de tareas (get, post agregar, post completar, etc) ...

app.listen(8080, '0.0.0.0', () => {
    console.log("Servidor corriendo en el puerto 8080");
});