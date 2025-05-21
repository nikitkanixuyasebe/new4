const ticketList = document.getElementById('ticketList');
const selectedTicketsBox = document.getElementById('selectedTicketsBox');
const ticketCountInput = document.getElementById('ticketCount');
const randomTicketsBtn = document.getElementById('randomTickets');
const payButton = document.getElementById('payButton');

const TICKET_PRICE = 150;

let takenTickets = [];  // Занятые билеты
let selectedTickets = []; // Выбранные пользователем

// Загружаем занятые билеты с сервера
async function loadTakenTickets() {
  try {
    const res = await fetch('http://localhost:3000/taken-tickets');
    const data = await res.json();
    takenTickets = data.taken || [];

    // Заполняем список билетов (1–300)
    ticketList.innerHTML = '';
    for (let i = 1; i <= 300; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = Билет №${i};
      if (takenTickets.includes(i)) {
        option.disabled = true; // Отключаем занятые билеты
        option.textContent += ' (занят)';
      }
      ticketList.appendChild(option);
    }
  } catch (e) {
    alert('Ошибка загрузки занятых билетов');
  }
}

// Обновляем отображение выбранных билетов справа
function updateSelectedTicketsDisplay() {
  if (selectedTickets.length === 0) {
    selectedTicketsBox.textContent = 'Билеты не выбраны';
  } else {
    selectedTicketsBox.textContent = 'Выбраны билеты: ' + selectedTickets.join(', ');
  }
  // Обновляем сумму
  document.getElementById('totalPrice').textContent = selectedTickets.length * TICKET_PRICE;
}

// Событие выбора билетов в списке
ticketList.addEventListener('change', () => {
  selectedTickets = Array.from(ticketList.selectedOptions)
    .map(opt => Number(opt.value))
    .filter(v => !takenTickets.includes(v)); // Только доступные

  updateSelectedTicketsDisplay();
});

// Кнопка «Рандомные билеты»
randomTicketsBtn.addEventListener('click', () => {
  const count = Number(ticketCountInput.value);
  if (count < 1 || count > 300) {
    alert('Введите корректное количество билетов');
    return;
  }

  // Берём доступные билеты (не занятые)
  const availableTickets = [];
  for(let i = 1; i <= 300; i++) {
    if (!takenTickets.includes(i)) availableTickets.push(i);
  }

  if (count > availableTickets.length) {
    alert('Недостаточно доступных билетов');
    return;
  }

  // Случайный выбор count билетов
  selectedTickets = [];
  while(selectedTickets.length < count) {
    const rand = availableTickets[Math.floor(Math.random() * availableTickets.length)];
    if (!selectedTickets.includes(rand)) selectedTickets.push(rand);
  }

  // Отмечаем выбранные билеты в списке
  Array.from(ticketList.options).forEach(opt => {
    opt.selected = selectedTickets.includes(Number(opt.value));
  });

  updateSelectedTicketsDisplay();
});

// Кнопка «Оплатить»
payButton.addEventListener('click', async () => {
  if (selectedTickets.length === 0) {
    alert('Выберите билеты для оплаты');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tickets: selectedTickets })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Билеты успешно забронированы: ' + selectedTickets.join(', '));
      await loadTakenTickets(); // Обновляем занятые билеты
      selectedTickets = [];
      updateSelectedTicketsDisplay();
    } else {
      alert('Ошибка бронирования: ' + (data.error || 'Неизвестная ошибка'));
      // Можно обновить занятые билеты, вдруг кто-то успел занять
      await loadTakenTickets();
      selectedTickets = [];
      updateSelectedTicketsDisplay();
    }
  } catch (e) {
    alert('Ошибка при подключении к серверу');
  }
});

// При загрузке страницы подгружаем занятые билеты
loadTakenTickets();
updateSelectedTicketsDisplay();
