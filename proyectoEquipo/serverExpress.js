const express = require('express');
const path = require('path');
const app = express();

// Esto le dice a Express que la carpeta 'public' está junto a este archivo
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
    // Esto busca el index.html dentro de la carpeta public de forma segura
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ... resto de tus rutas (agregar, completar, eliminar) ...

app.listen(8080, '0.0.0.0', () => {
    console.log("Servidor corriendo en http://localhost:8080");
});