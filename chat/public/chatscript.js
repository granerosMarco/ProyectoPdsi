 // ── Obtener nombre guardado ──────────────────────────────────────────
    const username = sessionStorage.getItem("chatUsername");
    if (!username) {
      window.location.href = "/";  // Redirigir si no hay nombre
    }

    // ── Conectar al servidor ─────────────────────────────────────────────
    const socket = io();

    // Enviar nombre al servidor al conectar
    socket.emit("set username", username);

    // ── Referencias al DOM ───────────────────────────────────────────────
    const messagesEl  = document.getElementById("messages");
    const msgInput    = document.getElementById("msg-input");
    const sendBtn     = document.getElementById("send-btn");
    const userCountEl = document.getElementById("user-count");

    // ── Función: agregar mensaje al chat ─────────────────────────────────
    function addMessage({ type, username, color, message, time }) {
      const wrapper = document.createElement("div");

      if (type === "notification") {
        // Notificación de sistema (usuario entró/salió)
        wrapper.className = "chat-notification";
        wrapper.textContent = message;
        messagesEl.appendChild(wrapper);
      } else {
        // Mensaje normal
        const isMine = (username === sessionStorage.getItem("chatUsername") &&
                        color === myColor);
        wrapper.className = "chat-bubble-wrapper " + (isMine ? "mine" : "other");

        wrapper.innerHTML = `
          <span class="chat-username" style="color: ${color}">${username}</span>
          <div class="chat-bubble" style="${isMine
            ? `background:${color}; color:#fff;`
            : `border-left: 3px solid ${color};`}">
            ${message}
          </div>
          <span class="chat-time">${time}</span>
        `;
        messagesEl.appendChild(wrapper);
      }

      // Auto-scroll al último mensaje
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // ── Color propio (se recibe del servidor) ────────────────────────────
    let myColor = "#999";

    // ── Eventos del servidor ─────────────────────────────────────────────

    socket.on("username ok", ({ username: name, color }) => {
      myColor = color;
      addMessage({
        type: "notification",
        message: `✅ Conectado como "${name}"`,
      });
    });

    socket.on("username error", (msg) => {
      alert(msg);
      window.location.href = "/";
    });

    socket.on("user joined", ({ username: name, color, userCount }) => {
      userCountEl.textContent = `${userCount} usuario(s)`;
      addMessage({
        type: "notification",
        message: `👋 ${name} se unió al chat`,
      });
    });

    socket.on("user left", ({ username: name, userCount }) => {
      userCountEl.textContent = `${userCount} usuario(s)`;
      addMessage({
        type: "notification",
        message: `🚪 ${name} salió del chat`,
      });
    });

    socket.on("chat message", (data) => {
      addMessage({ type: "message", ...data });
    });

    // ── Enviar mensaje ───────────────────────────────────────────────────
    function sendMessage() {
      const text = msgInput.value.trim();
      if (!text) return;
      socket.emit("chat message", text);
      msgInput.value = "";
      msgInput.focus();
    }

    sendBtn.addEventListener("click", sendMessage);
    msgInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage();
    });