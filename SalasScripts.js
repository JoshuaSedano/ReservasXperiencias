// -------------------------------
// Actualizar tabla de horarios al cambiar la sala
// -------------------------------
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
    const selectHoraInicio = createSelect('horaInicioHora', 'horaInicioHora_0', 19);
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
    const selectHoraFin = createSelect('horaFinHora', 'horaFinHora_0', 19);
    selectHoraFin.classList.add('horaFinHora');
    const selectMinutoFin = createSelectMinutes('horaFinMinuto', 'horaFinMinuto_0');
    selectMinutoFin.classList.add('horaFinMinuto');
    cellFin.appendChild(selectHoraFin);
    cellFin.appendChild(selectMinutoFin);
    row.appendChild(cellFin);

    // Ajusta automáticamente la hora fin (por ejemplo, 30 minutos después de la hora inicio)
    adjustFinForRow(row);

    tbody.appendChild(row);
  }
}

// -------------------------------
// Funciones para crear los select de horas y minutos
// -------------------------------

function createSelect(name, id, max) {
  const select = document.createElement('select');
  select.name = name;
  select.id = id;
  for (let i = 9; i < max; i++) {
    const option = document.createElement('option');
    option.value = String(i).padStart(2, '0');
    option.text = String(i).padStart(2, '0');
    select.appendChild(option);
  }
  return select;
}
// Crea un select para minutos con las opciones: 00, 15, 30, 45, con opción por defecto
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

// Ajusta la hora fin a 30 minutos después de la hora inicio en la fila indicada
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
// -------------------------------
// Enviar el formulario a SheetDB (Excel/Google Sheets)
// -------------------------------
document.getElementById('reservaForm').addEventListener('submit', e => {
  e.preventDefault();

  // Recoger datos del formulario
  const formData = new FormData(document.getElementById('reservaForm'));
  const fecha = formData.get('fecha');
  const motivo = formData.get('motivo');
  const nPersonas = formData.get('nPersonas');
  
  // Obtener la sala seleccionada y su texto (para mayor claridad)
  const salaSelect = document.getElementById('sala');
  const salaValue = salaSelect.value;
  const salaText = salaSelect.options[salaSelect.selectedIndex].text;

  // Recoger los horarios de la tabla (suponiendo que solo hay una fila)
  const row = document.querySelector('#horasTable tbody tr');
  let inicio = '';
  let fin = '';
  if (row) {
    const horaInicioHour = row.querySelector('.horaInicioHora').value;
    const horaInicioMinute = row.querySelector('.horaInicioMinuto').value;
    const horaFinHour = row.querySelector('.horaFinHora').value;
    const horaFinMinute = row.querySelector('.horaFinMinuto').value;
    inicio = horaInicioHour + ':' + horaInicioMinute;
    fin = horaFinHour + ':' + horaFinMinute;
  }

  // Construir el objeto con la información de la reserva
  const reserva = {
    "Fecha": fecha,
    "Sala": salaText,
    "N°Personas": nPersonas,
    "Inicio": inicio,
    "Fin": fin,
    "Motivo": motivo
  };

  // Enviar datos a SheetDB (que estará enlazado a tu hoja de cálculo)
  fetch('https://sheetdb.io/api/v1/td4sbrvtrviyp?sheet=Salas', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: [reserva] })
  })
  .then(response => response.json())
  .then(result => {
    console.log('Respuesta de SheetDB:', result);
    alert('Reserva enviada correctamente');
    document.getElementById('reservaForm').reset();
    document.getElementById('horasTableContainer').style.display = 'none';
  })
  .catch(err => {
    console.error('Error al enviar:', err);
    alert('Error al enviar la reserva');
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const salaSelect = document.getElementById("sala");
  const nPersonasInput = document.getElementById("nPersonas");
  const videoCheckbox = document.getElementById("videollamada");
  
  // Creamos un array con toda la información de las salas
  let allSalas = [];
  // Iteramos por cada optgroup y opción existente en el select
  document.querySelectorAll("#sala optgroup").forEach(optgroup => {
    const groupLabel = optgroup.getAttribute("label");
    optgroup.querySelectorAll("option").forEach(option => {
      // Solo las opciones con value (omitimos el default que tiene value = "")
      if(option.value) {
        allSalas.push({
          group: groupLabel,
          value: option.value,
          name: option.textContent, // Solo el nombre se mostrará
          capacity: parseInt(option.getAttribute("data-capacity"), 10),
          videoconference: option.getAttribute("data-videoconference") === "true"
        });
      }
    });
  });
  
  // Función que filtra las salas según el número de personas y si necesita videollamada
  function filterSalas() {
    const nPersonas = parseInt(nPersonasInput.value, 10) || 0;
    const needVideo = videoCheckbox.checked;

    // Filtrar el array de salas según los criterios
    const filteredSalas = allSalas.filter(sala => {
      if (nPersonas > 0 && sala.capacity < nPersonas) return false;
      if (needVideo && !sala.videoconference) return false;
      return true;
    });

    // Reconstruir el select con los resultados filtrados
    // Primero, limpiar el select y agregar la opción por defecto
    salaSelect.innerHTML = "";
    const defOption = document.createElement("option");
    defOption.value = "";
    defOption.text = "-- Elija una sala --";
    defOption.disabled = true;
    defOption.selected = true;
    salaSelect.appendChild(defOption);

    // Se agrupan las salas filtradas por grupo (optgroup)
    const groups = {};
    filteredSalas.forEach(sala => {
      if (!groups[sala.group]) groups[sala.group] = [];
      groups[sala.group].push(sala);
    });

    // Para cada grupo, se crea un optgroup y se agregan las opciones
    for (const group in groups) {
      const optgroup = document.createElement("optgroup");
      optgroup.label = group;
      groups[group].forEach(sala => {
        const option = document.createElement("option");
        option.value = sala.value;
        option.text = sala.name;
        option.setAttribute("data-capacity", sala.capacity);
        option.setAttribute("data-videoconference", sala.videoconference);
        optgroup.appendChild(option);
      });
      // Solo se agrega el grupo si tiene opciones disponibles
      if (optgroup.children.length > 0) {
        salaSelect.appendChild(optgroup);
      }
    }
  }
  
  // Agregar eventos para disparar el filtrado al cambiar el número de personas o el check de videollamada
  nPersonasInput.addEventListener("input", filterSalas);
  videoCheckbox.addEventListener("change", filterSalas);
  
  // Llamamos una vez para que se cargue el select con todas las salas (sin filtro)
  filterSalas();
});