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

      // Celda de la sala
      const cellSala = document.createElement('td');
      cellSala.textContent = checkbox.value;
      row.appendChild(cellSala);

      // Celda de hora inicio con dos select (hora y minuto)
      const cellInicio = document.createElement('td');
      const selectHoraInicio = createSelect('horaInicioHora', 'horaInicioHora_' + index, 24);
      selectHoraInicio.classList.add('horaInicioHora');
      selectHoraInicio.addEventListener('change', () => adjustFinForRow(row));
      const selectMinutoInicio = createSelectMinutes('horaInicioMinuto', 'horaInicioMinuto_' + index);
      selectMinutoInicio.classList.add('horaInicioMinuto');
      selectMinutoInicio.addEventListener('change', () => adjustFinForRow(row));
      cellInicio.appendChild(selectHoraInicio);
      cellInicio.appendChild(selectMinutoInicio);
      row.appendChild(cellInicio);

      // Celda de hora fin con dos select (hora y minuto)
      const cellFin = document.createElement('td');
      const selectHoraFin = createSelect('horaFinHora', 'horaFinHora_' + index, 24);
      selectHoraFin.classList.add('horaFinHora');
      const selectMinutoFin = createSelectMinutes('horaFinMinuto', 'horaFinMinuto_' + index);
      selectMinutoFin.classList.add('horaFinMinuto');
      cellFin.appendChild(selectHoraFin);
      cellFin.appendChild(selectMinutoFin);
      row.appendChild(cellFin);

      // Se ajusta automáticamente la hora fin (30 minutos más que la hora inicio)
      adjustFinForRow(row);

      tbody.appendChild(row);
    });
  }

  // Función para crear un select con opciones de 0 a n-1 (para horas)
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
