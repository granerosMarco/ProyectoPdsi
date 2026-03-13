const input = document.getElementById('inputTarea');
const btnAdd = document.getElementById('btnAgregar');
const btnRem = document.getElementById('btnRemover');
const btnDelFinal = document.getElementById('btnEliminarFinal');

async function refrescar() {
    const res = await fetch('/tareas');
    const data = await res.json();
    
    // Renderizar Pendientes (con checkbox para completar)
    document.getElementById('listaPendientes').innerHTML = data.pendientes.map((t, i) => 
        `<li><label><input type="checkbox" class="chk-pend" value="${i}"> ${t}</label></li>`).join('');
    
    // Renderizar Realizadas (con checkbox para eliminar definitivo)
    document.getElementById('listaRealizadas').innerHTML = data.realizadas.map((t, i) => 
        `<li class="tarea-realizada"><label><input type="checkbox" class="chk-real" value="${i}"> ${t}</label></li>`).join('');
}

// Evento Agregar 
btnAdd.onclick = async () => {
    const res = await fetch('/agregar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ tarea: input.value })
    });
    const data = await res.json();
    if (data.msg) alert(data.msg); 
    input.value = '';
    refrescar();
};

// Evento: Mover a realizadas
btnRem.onclick = async () => {
    const checks = document.querySelectorAll('.chk-pend:checked');
    const indices = Array.from(checks).map(c => parseInt(c.value));
    if (indices.length === 0) return alert("Selecciona tareas para completar");

    await fetch('/completar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ indices })
    });
    refrescar();
};

// Evento: Eliminar de realizadas
btnDelFinal.onclick = async () => {
    const checks = document.querySelectorAll('.chk-real:checked');
    const indices = Array.from(checks).map(c => parseInt(c.value));
    if (indices.length === 0) return alert("Selecciona tareas para borrar");

    await fetch('/eliminar-final', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ indices })
    });
    refrescar();
};

window.onload = refrescar;