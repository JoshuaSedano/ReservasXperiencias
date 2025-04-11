// ============================
// Envío del formulario a SheetDB
// ============================
document.getElementById('formulario').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(e.target);

  // Obtener todos los checkboxes marcados
  const checkboxes = document.querySelectorAll('#XPChecklist input[type="checkbox"]:checked');

  // Obtener todas las filas de la tabla
  const filas = document.querySelectorAll('#horasTable tbody tr');

  // Vamos a construir un array de objetos, uno por fila
  const dataArray = [];

  // Suponiendo que cada fila en la tabla corresponde a su respectivo checkbox:
  filas.forEach((fila, index) => {
    // Recuperar la experiencia de su checkbox correspondiente
    const experiencia = checkboxes[index]?.value || '';

    // Seleccionar los select de hora/minuto
    const horaInicioHour   = fila.querySelector('.horaInicioHora');
    const horaInicioMinute = fila.querySelector('.horaInicioMinuto');
    const horaFinHour      = fila.querySelector('.horaFinHora');
    const horaFinMinute    = fila.querySelector('.horaFinMinuto');

    // Construir la hora inicio y fin
    let inicio = '';
    let fin = '';
    if (horaInicioHour && horaInicioMinute) {
      inicio = horaInicioHour.value + ':' + horaInicioMinute.value;
    }
    if (horaFinHour && horaFinMinute) {
      fin = horaFinHour.value + ':' + horaFinMinute.value;
    }

    // Armar el objeto
    const dataObj = {
      "Fecha": formData.get('fecha'),
      "Experiencia": experiencia,
      "Inicio": inicio,
      "Fin": fin,
      "Motivo": formData.get('motivo'),
      // "Personas": formData.get('nPersonas')
    };

    dataArray.push(dataObj);
  });

  // Enviar todo el array a SheetDB
  fetch('https://sheetdb.io/api/v1/td4sbrvtrviyp?sheet=Experiencias', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: dataArray })
  })
  .then(response => response.json())
  .then(result => {
    console.log('Respuesta de SheetDB:', result);
    alert('Reserva enviada correctamente');
    e.target.reset(); 
  })
  .catch(err => {
    console.error('Error al enviar:', err);
    alert('Error al enviar la reserva');
  });
});

// ============================
// Actualización dinámica de la tabla de horarios
// ============================

// Agregar evento a cada checkbox para actualizar la tabla de horarios
document.querySelectorAll('#XPChecklist input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', updateHorasTable);
});

function updateHorasTable() {
  const tableContainer = document.getElementById('horasTableContainer');
  const tbody = document.getElementById('horasTable').querySelector('tbody');
  tbody.innerHTML = ''; // Se elimina el contenido previo

  // Se obtienen los checkboxes seleccionados
  const checkboxes = document.querySelectorAll('#XPChecklist input[type="checkbox"]:checked');
  if (checkboxes.length > 0) {
    tableContainer.style.display = 'block';
  } else {
    tableContainer.style.display = 'none';
  }

  // Para cada sala seleccionada se crea una fila en la tabla
  checkboxes.forEach((checkbox, index) => {
    const row = document.createElement('tr');

    // Celda con el nombre de la sala
    const cellSala = document.createElement('td');
    cellSala.textContent = checkbox.value;
    row.appendChild(cellSala);

    // Celda para hora de inicio (con selects para hora y minuto)
    const cellInicio = document.createElement('td');
    const selectHoraInicio = createSelect('horaInicioHora', 'horaInicioHora_' + index, 24);
    selectHoraInicio.classList.add('horaInicioHora');
    // Al cambiar el select, se ajusta automáticamente la hora fin
    selectHoraInicio.addEventListener('change', () => adjustFinForRow(row));
    const selectMinutoInicio = createSelectMinutes('horaInicioMinuto', 'horaInicioMinuto_' + index);
    selectMinutoInicio.classList.add('horaInicioMinuto');
    selectMinutoInicio.addEventListener('change', () => adjustFinForRow(row));
    cellInicio.appendChild(selectHoraInicio);
    cellInicio.appendChild(selectMinutoInicio);
    row.appendChild(cellInicio);

    // Celda para hora de fin (con selects para hora y minuto)
    const cellFin = document.createElement('td');
    const selectHoraFin = createSelect('horaFinHora', 'horaFinHora_' + index, 24);
    selectHoraFin.classList.add('horaFinHora');
    const selectMinutoFin = createSelectMinutes('horaFinMinuto', 'horaFinMinuto_' + index);
    selectMinutoFin.classList.add('horaFinMinuto');
    cellFin.appendChild(selectHoraFin);
    cellFin.appendChild(selectMinutoFin);
    row.appendChild(cellFin);

    // Se ajusta automáticamente la hora fin a 30 minutos después de la hora inicio
    adjustFinForRow(row);

    tbody.appendChild(row);
  });
}

// Función para crear un select con opciones numéricas (para horas)
function createSelect(name, id, max) {
  const select = document.createElement('select');
  select.name = name;
  select.id = id;
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
  ['00', '15', '30', '45'].forEach(min => {
    const option = document.createElement('option');
    option.value = min;
    option.text = min;
    select.appendChild(option);
  });
  return select;
}

// Función para ajustar la hora fin a 30 minutos después de la hora inicio en una fila determinada
function adjustFinForRow(row) {
  const horaInicioHour = row.querySelector('.horaInicioHora');
  const horaInicioMinute = row.querySelector('.horaInicioMinuto');
  const horaFinHour = row.querySelector('.horaFinHora');
  const horaFinMinute = row.querySelector('.horaFinMinuto');
  const h = parseInt(horaInicioHour.value, 10);
  const m = parseInt(horaInicioMinute.value, 10);
  const date = new Date();
  date.setHours(h);
  date.setMinutes(m + 30);
  horaFinHour.value = String(date.getHours()).padStart(2, '0');
  horaFinMinute.value = String(date.getMinutes()).padStart(2, '0');
}
