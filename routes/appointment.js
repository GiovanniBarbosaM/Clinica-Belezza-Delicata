document.getElementById('filter').addEventListener('input', function() {
    const filterValue = this.value.toLowerCase();
    // Supondo que você tenha um array de eventos de consultas
    const filteredEvents = events.filter(event => {
        return event.title.toLowerCase().includes(filterValue) || 
               event.start.toLowerCase().includes(filterValue);
    });
    // Atualize o calendário com eventos filtrados
    updateCalendar(filteredEvents);
});

// Função para atualizar o calendário
function updateCalendar(events) {
    calendar.removeAllEvents();
    calendar.addEventSource(events);
}
