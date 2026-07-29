// URL de tu API (Cámbiala cuando despliegues en la nube)
const API_URL = 'http://localhost:3000/tickets';

document.addEventListener('DOMContentLoaded', () => {
    cargarTickets();

    const form = document.getElementById('ticket-form');
    form.addEventListener('submit', guardarTicket);
});

// Función para obtener e imprimir todos los tickets
async function cargarTickets() {
    try {
        const res = await fetch(API_URL);
        const tickets = await res.json();

        const tableBody = document.getElementById('tickets-table-body');
        tableBody.innerHTML = '';

        let pendientes = 0;
        let enProceso = 0;

        tickets.forEach(ticket => {
            if (ticket.estado === 'pendiente') pendientes++;
            if (ticket.estado === 'en proceso') enProceso++;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${ticket.id}</td>
                <td>
                    <strong>${ticket.titulo}</strong><br>
                    <small style="color: #64748b;">${ticket.descripcion || ''}</small>
                </td>
                <td><span class="badge ${ticket.estado.replace(' ', '-')}">${ticket.estado}</span></td>
                <td>
                    <button class="btn-delete" onclick="eliminarTicket(${ticket.id})">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Actualizar métricas del Dashboard
        document.getElementById('total-tickets').textContent = tickets.length;
        document.getElementById('pending-tickets').textContent = pendientes;
        document.getElementById('process-tickets').textContent = enProceso;

    } catch (error) {
        console.error('Error al cargar tickets:', error);
    }
}

// Función para guardar un ticket
async function guardarTicket(e) {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const estado = document.getElementById('estado').value;

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, descripcion, estado })
        });

        if (res.ok) {
            document.getElementById('ticket-form').reset();
            cargarTickets();
        }
    } catch (error) {
        console.error('Error al crear ticket:', error);
    }
}

// Función para eliminar un ticket
async function eliminarTicket(id) {
    if (!confirm('¿Estás seguro de eliminar este ticket?')) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            cargarTickets();
        }
    } catch (error) {
        console.error('Error al eliminar ticket:', error);
    }
}