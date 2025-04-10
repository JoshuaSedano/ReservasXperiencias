// Se agrega el evento 'change' al select de sala para actualizar la tabla de horarios
document.getElementById('sala').addEventListener('change', updateHorasTable);

function updateHorasTable() {
  const tableContainer = document.getElementById('horasTableContainer');
  const tbody = document.getElementById('horasTable').querySelector('tbody');
  tbody.innerHTML = ''; // Limpia cualquier contenido previo

  const salaSelect = document.getElementById('sala');
  const selectedValue = salaSelect.value;
  
  if (selectedValue && selectedValue !== "") {
    tableContainer.style.display = 'block';

    // Creamos una fila para la sala seleccionada
    const row = document.createElement('tr');

    // Celda para la sala: usamos el texto de la opción seleccionada
    const cellSala = document.createElement('td');
    const selectedText = salaSelect.options[salaSelect.selectedIndex].text;
    cellSala.textContent = selectedText;
    row.appendChild(cellSala);

    // Celda para la hora de inicio (dos selects: hora y minuto)
    const cellInicio = document.createElement('td');
    const selectHoraInicio = createSelect('horaInicioHora', 'horaInicioHora_0', 24);
    selectHoraInicio.classList.add('horaInicioHora');
    selectHoraInicio.addEventListener('change', () => adjustFinForRow(row));
    const selectMinutoInicio = createSelectMinutes('horaInicioMinuto', 'horaInicioMinuto_0');
    selectMinutoInicio.classList.add('horaInicioMinuto');
    selectMinutoInicio.addEventListener('change', () => adjustFinForRow(row));
    cellInicio.appendChild(selectHoraInicio);
    cellInicio.appendChild(selectMinutoInicio);
    row.appendChild(cellInicio);

    // Celda para la hora de fin (dos selects: hora y minuto)
    const cellFin = document.createElement('td');
    const selectHoraFin = createSelect('horaFinHora', 'horaFinHora_0', 24);
    selectHoraFin.classList.add('horaFinHora');
    const selectMinutoFin = createSelectMinutes('horaFinMinuto', 'horaFinMinuto_0');
    selectMinutoFin.classList.add('horaFinMinuto');
    cellFin.appendChild(selectHoraFin);
    cellFin.appendChild(selectMinutoFin);
    row.appendChild(cellFin);

    // Ajusta automáticamente la hora fin (por ejemplo, 30 minutos después de la hora inicio)
    adjustFinForRow(row);

    tbody.appendChild(row);
  } else {
    tableContainer.style.display = 'none';
  }
}

// Función para crear un select con opciones numéricas para horas
function createSelect(name, id, max) {
  const select = document.createElement('select');
  select.name = name;
  select.id = id;
  
  // Opción por defecto
  const defaultOption = document.createElement('option');
  defaultOption.value = "";
  defaultOption.text = "--";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);
  
  for (let i = 0; i < max; i++) {
    const option = document.createElement('option');
    option.value = String(i).padStart(2, '0');
    option.text = String(i).padStart(2, '0');
    select.appendChild(option);
  }
  return select;
}

// Función para crear un select para minutos (00, 15, 30, 45)
function createSelectMinutes(name, id) {
  const select = document.createElement('select');
  select.name = name;
  select.id = id;
  
  // Opción por defecto
  const defaultOption = document.createElement('option');
  defaultOption.value = "";
  defaultOption.text = "--";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);
  
  ['00', '15', '30', '45'].forEach(min => {
    const option = document.createElement('option');
    option.value = min;
    option.text = min;
    select.appendChild(option);
  });
  return select;
}

// Función para ajustar la hora fin a 30 minutos después de la hora inicio en la fila indicada
function adjustFinForRow(row) {
  const horaInicioHour = row.querySelector('.horaInicioHora');
  const horaInicioMinute = row.querySelector('.horaInicioMinuto');
  const horaFinHour = row.querySelector('.horaFinHora');
  const horaFinMinute = row.querySelector('.horaFinMinuto');
  
  const h = parseInt(horaInicioHour.value, 10);
  const m = parseInt(horaInicioMinute.value, 10);
  if (isNaN(h) || isNaN(m)) return; // Si falta algún dato, no hace nada
  
  const date = new Date();
  date.setHours(h);
  date.setMinutes(m + 30);
  
  horaFinHour.value = String(date.getHours()).padStart(2, '0');
  horaFinMinute.value = String(date.getMinutes()).padStart(2, '0');
}

// Evita el envío real del formulario para propósitos de prueba
document.getElementById('reservaForm').addEventListener('submit', e => {
  e.preventDefault();
  alert('Reserva enviada (aquí podrías manejar la lógica real)!');
});
