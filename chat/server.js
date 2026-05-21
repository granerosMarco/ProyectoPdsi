const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// ─── Utilidades de seguridad ───────────────────────────────────────────────

/**
 * Escapa caracteres HTML para evitar inyección de código (XSS).
 * Reemplaza los caracteres especiales por sus entidades HTML.
 */
function sanitize(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// ─── Colores disponibles (8 colores, se repiten en orden) ─────────────────

const USER_COLORS = [
  "#E74C3C", // Rojo
  "#3498DB", // Azul
  "#2ECC71", // Verde
  "#F39C12", // Naranja
  "#9B59B6", // Morado
  "#1ABC9C", // Turquesa
  "#E67E22", // Zanahoria
  "#2980B9", // Azul oscuro
];

// Contador para asignar colores en orden circular
let colorIndex = 0;

// Mapa de usuarios conectados: socketId -> { username, color }
const users = {};

// ─── Lógica de Socket.io ──────────────────────────────────────────────────

io.on("connection", (socket) => {
  console.log(`Nueva conexión: ${socket.id}`);

  // ── Evento: el usuario envía su nombre ──
  socket.on("set username", (rawName) => {
    // Sanitizar y validar el nombre
    const username = sanitize(rawName).trim().slice(0, 30);
    if (!username) {
      socket.emit("username error", "El nombre no puede estar vacío.");
      return;
    }

    // Asignar color de forma circular
    const color = USER_COLORS[colorIndex % USER_COLORS.length];
    colorIndex++;

    // Guardar usuario
    users[socket.id] = { username, color };

    // Confirmar registro al cliente
    socket.emit("username ok", { username, color });

    // Notificar a todos que un usuario se unió
    io.emit("user joined", {
      username,
      color,
      userCount: Object.keys(users).length,
    });

    console.log(`Usuario registrado: ${username} (${color})`);
  });

  // ── Evento: el usuario envía un mensaje ──
  socket.on("chat message", (rawMsg) => {
    const user = users[socket.id];
    if (!user) return; // ignorar si no tiene nombre registrado

    // Sanitizar el mensaje
    const message = sanitize(rawMsg).trim().slice(0, 500);
    if (!message) return;

    // Difundir el mensaje a todos los clientes
    io.emit("chat message", {
      username: user.username,
      color: user.color,
      message,
      time: new Date().toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  });

  // ── Evento: el usuario se desconecta ──
  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      delete users[socket.id];
      io.emit("user left", {
        username: user.username,
        color: user.color,
        userCount: Object.keys(users).length,
      });
      console.log(`Usuario desconectado: ${user.username}`);
    }
  });
});

// ─── Iniciar servidor ─────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n✅  Servidor corriendo en http://0.0.0.0:${PORT}`);
  console.log(`   Accesible en la red local por IP del equipo servidor\n`);
});