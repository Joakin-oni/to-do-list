

let tareas = [];
let deferredPrompt = null;

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

    const installBtn = document.getElementById("installBtn");

    document.getElementById("agregarBtn").addEventListener("click", agregar);

    document.getElementById("tarea").addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") {
            agregar();
        }
    });

    window.addEventListener("beforeinstallprompt", (evento) => {
        evento.preventDefault();
        deferredPrompt = evento;
        installBtn.hidden = false;
    });

    installBtn.addEventListener("click", async () => {
        if (!deferredPrompt) {
            alert("La instalación no está disponible en este navegador en este momento.");
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            console.log("PWA instalada");
        } else {
            console.log("Instalación cancelada");
        }

        deferredPrompt = null;
        installBtn.hidden = true;
    });

    window.addEventListener("appinstalled", () => {
        installBtn.hidden = true;
    });

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("./service-worker.js").catch((error) => {
                console.error("No se pudo registrar el service worker:", error);
            });
        });
    }
});