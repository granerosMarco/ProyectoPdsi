const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080; // Puerto solicitado [cite: 31]

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let pendientes = [];
let realizadas = [];

// Obtener listas (Característica 4 y 6) [cite: 22, 24]
app.get('/tareas', (req, res) => {
    res.json({ pendientes, realizadas });
});

// Agregar tarea con validaciones (Característica 7 y 8) [cite: 25, 26]
app.post('/agregar', (req, res) => {
    const nueva = req.body.tarea.trim();
    if (!nueva) return res.status(400).json({ msg: "La caja de texto está vacía." });
    if (pendientes.includes(nueva) || realizadas.includes(nueva)) {
        return res.status(400).json({ msg: "La tarea ya existe." });
    }
    pendientes.push(nueva);
    res.json({ success: true });
});

// Mover de pendientes a realizadas (Característica 5) 
app.post('/completar', (req, res) => {
    const indices = req.body.indices.sort((a, b) => b - a);
    indices.forEach(i => {
        const tarea = pendientes.splice(i, 1);
        realizadas.push(tarea[0]);
    });
    res.json({ success: true });
});

// Eliminar tareas realizadas permanentemente
app.post('/eliminar-final', (req, res) => {
    const indices = req.body.indices.sort((a, b) => b - a);
    indices.forEach(i => {
        realizadas.splice(i, 1);
    });
    res.json({ success: true });
});

app.listen(8080, '0.0.0.0', () => { // inicia servidor puerto 8080
    console.log('Servidor corriendo en http://0.0.0.0:8080'); // mensaje inicio
});