let tareas = [];

function guardarTareas() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

function cargarTareas() {
    const datos = localStorage.getItem("tareas");
    return datos ? JSON.parse(datos) : [];
}

function renderizarTareas() {
    const lista = document.getElementById("listaTareas");
    lista.innerHTML = "";

    tareas.forEach((texto, indice) => {
        const item = document.createElement("li");
        item.textContent = texto;

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.onclick = () => {
            tareas.splice(indice, 1);
            guardarTareas();
            renderizarTareas();
        };

        item.appendChild(botonEliminar);
        lista.appendChild(item);
    });
}

function agregar() {
    const texto = document.getElementById("tarea").value.trim();

    if (texto === "") {
        alert("ingresa una tarea.");
        return;
    }

    tareas.push(texto);
    guardarTareas();
    renderizarTareas();
    document.getElementById("tarea").value = "";
}

window.addEventListener("DOMContentLoaded", () => {
    tareas = cargarTareas();
    renderizarTareas();

    document.getElementById("agregarBtn").addEventListener("click", agregar);

    document.getElementById("tarea").addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") {
            agregar();
        }
    });
});