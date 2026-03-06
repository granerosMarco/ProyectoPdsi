const input = document.getElementById('inputTarea');
const btnAdd = document.getElementById('btnAgregar');
const btnRem = document.getElementById('btnRemover');

async function refrescar() {
    const res = await fetch('/tareas');
    const data = await res.json();
    
    document.getElementById('listaPendientes').innerHTML = data.pendientes.map((t, i) => 
        `<li><input type="checkbox" value="${i}"> ${t}</li>`).join('');
    
    document.getElementById('listaRealizadas').innerHTML = data.realizadas.map(t => 
        `<li style="color:gray; text-decoration:line-through">${t}</li>`).join('');
}

btnAdd.onclick = async () => {
    const res = await fetch('/agregar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ tarea: input.value })
    });
    const data = await res.json();
    if (data.msg) alert(data.msg); // Alertas (Característica 7 y 8)
    input.value = '';
    refrescar();
};

btnRem.onclick = async () => {
    const checks = document.querySelectorAll('input[type="checkbox"]:checked');
    const indices = Array.from(checks).map(c => parseInt(c.value));
    if (indices.length === 0) return;

    await fetch('/completar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ indices })
    });
    refrescar();
};

window.onload = refrescar;