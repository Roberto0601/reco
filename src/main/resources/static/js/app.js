const BACKEND_URL = 'https://reco-yuy9.onrender.com';
const API_BASE = `${BACKEND_URL}/spaces`;
const RESERVATIONS_API = `${BACKEND_URL}/reservations`;

const state = {
  spaces: [],
  reservations: [],
};

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const form = $('#reservation-form');
const spaceSelect = $('#spaceId');
const spacesGrid = $('#spaces-grid');
const spacesLoading = $('#spaces-loading');
const reservationsBody = $('#reservations-body');
const btnRefresh = $('#btn-refresh-spaces');
const toastContainer = $('#toast-container');

async function fetchSpaces() {
  try {
    spacesLoading.textContent = 'Cargando espacios...';
    const res = await fetch(`${API_BASE}/all`);
    if (!res.ok) {
      if (res.status === 204) return [];
      throw new Error(`Error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Error al obtener espacios:', err);
    showToast('No se pudieron cargar los espacios.', 'error');
    return [];
  }
}

function renderSpaces(spaces) {
  if (spaces.length === 0) {
    spacesGrid.innerHTML = '<p class="text-muted">No hay espacios disponibles.</p>';
    spaceSelect.innerHTML = '<option value="">Seleccione un espacio</option>';
    return;
  }

  spacesGrid.innerHTML = spaces.map(s => `
    <article class="space-card">
      <div class="space-card__info">
        <span class="space-card__name">${escapeHtml(s.name)}</span>
        <span class="space-card__meta">${escapeHtml(s.type)} &middot; ${escapeHtml(s.location)}</span>
      </div>
      <span class="space-card__price">$${Number(s.price).toFixed(2)}</span>
    </article>
  `).join('');

  spaceSelect.innerHTML = `<option value="">Seleccione un espacio</option>${
    spaces.map(s => `<option value="${s.id}">#${s.id} - ${escapeHtml(s.name)}</option>`).join('')
  }`;
}

async function loadSpaces() {
  const spaces = await fetchSpaces();
  state.spaces = spaces;
  renderSpaces(spaces);
}

function addReservationToTable(r) {
  const statusClass =
    r.status === 'CONFIRMED' ? 'status-badge--confirmed' :
    r.status === 'CANCELED' ? 'status-badge--canceled' :
    'status-badge--pending';

  const emptyRow = reservationsBody.querySelector('tr td[colspan]');
  if (emptyRow) reservationsBody.innerHTML = '';

  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${r.id}</td>
    <td>#${r.spaceId}</td>
    <td>${escapeHtml(r.userEmail)}</td>
    <td>${formatDate(r.startDate)}</td>
    <td>${r.endDate}</td>
    <td><span class="status-badge ${statusClass}">${r.status}</span></td>
  `;
  reservationsBody.appendChild(row);
}

function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleString('es-CR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

function getFormData() {
  const data = {
    spaceId: parseInt(spaceSelect.value, 10),
    startDate: form.startDate.value,
    endDate: form.endDate.value,
    userEmail: form.userEmail.value.trim(),
  };
  return data;
}

function clearErrors() {
  $$('.form__control').forEach(el => el.classList.remove('form__control--error'));
  $$('.form__error').forEach(el => el.textContent = '');
}

function setError(fieldId, message) {
  const input = $(`#${fieldId}`);
  const errorEl = $(`#error-${fieldId}`);
  if (input) input.classList.add('form__control--error');
  if (errorEl) errorEl.textContent = message;
}

function validateForm(data) {
  clearErrors();
  let valid = true;

  if (!data.spaceId || isNaN(data.spaceId)) {
    setError('spaceId', 'Debe seleccionar un espacio.');
    valid = false;
  }

  if (!data.startDate) {
    setError('startDate', 'La fecha de inicio es obligatoria.');
    valid = false;
  }

  if (!data.endDate) {
    setError('endDate', 'La fecha de fin es obligatoria.');
    valid = false;
  } else if (data.startDate && new Date(data.endDate) <= new Date(data.startDate)) {
    setError('endDate', 'La fecha de fin debe ser posterior a la de inicio.');
    valid = false;
  }

  if (!data.userEmail) {
    setError('userEmail', 'El correo es obligatorio.');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail)) {
    setError('userEmail', 'Ingrese un correo válido.');
    valid = false;
  }

  return valid;
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showToast(message, type = 'success') {
  const icons = { success: '\u2713', error: '\u2717', warning: '\u26A0' };
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast__icon">${icons[type] || ''}</span>
    <span class="toast__message">${escapeHtml(message)}</span>
    <button class="toast__close" aria-label="Cerrar">&times;</button>
  `;
  toastContainer.appendChild(toast);

  const close = () => {
    if (!toast.isConnected) return;
    toast.classList.add('toast--removing');
    setTimeout(() => toast.remove(), 250);
  };

  toast.querySelector('.toast__close').addEventListener('click', close);

  if (type !== 'error') {
    setTimeout(close, 4000);
  }
}

async function submitReservation(data) {
  const btn = $('#btn-submit');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  try {
    const res = await fetch(`${RESERVATIONS_API}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errMsg = await res.text().catch(() => 'Error del servidor');
      throw new Error(errMsg || `Error ${res.status}`);
    }

    const message = await res.text();
    showToast(message || 'Reserva creada exitosamente.', 'success');

    const mockReservation = {
      id: Date.now(),
      spaceId: data.spaceId,
      userEmail: data.userEmail,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'PENDING',
    };
    state.reservations.push(mockReservation);
    addReservationToTable(mockReservation);

    form.reset();
    clearErrors();
  } catch (err) {
    console.error('Error al crear reserva:', err);

    let msg = err.message;
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      msg = 'No se pudo conectar con el servidor. Intente de nuevo.';

      const fallbackReservation = {
        id: Date.now(),
        spaceId: data.spaceId,
        userEmail: data.userEmail,
        startDate: data.startDate,
        endDate: data.endDate,
        status: 'PENDING',
      };
      state.reservations.push(fallbackReservation);
      addReservationToTable(fallbackReservation);
      showToast('Reserva creada localmente (sin conexión al servidor).', 'warning');
    } else {
      showToast(msg, 'error');
    }
  } finally {
    btn.disabled = false;
    btn.textContent = 'Crear Reserva';
  }
}

function handleSubmit(e) {
  e.preventDefault();
  const data = getFormData();
  if (!validateForm(data)) return;
  submitReservation(data);
}

function handleReset() {
  clearErrors();
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('reset', handleReset);
btnRefresh.addEventListener('click', loadSpaces);

loadSpaces();
