const input = document.getElementById("username-input");
    const btn   = document.getElementById("login-btn");
    const err   = document.getElementById("login-error");

    function goToChat() {
      const name = input.value.trim();
      if (!name) {
        err.textContent = "Por favor escribe un nombre.";
        input.focus();
        return;
      }
      // Guardar el nombre en sessionStorage para usarlo en chat.html
      sessionStorage.setItem("chatUsername", name);
      window.location.href = "chat.html";
    }

    btn.addEventListener("click", goToChat);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") goToChat();
    });