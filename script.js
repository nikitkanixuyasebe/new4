const ticketCountInput = document.getElementById("ticketCount");
const ticketList = document.getElementById("ticketList");
const totalPrice = document.getElementById("totalPrice");
const chooseTicketsBtn = document.getElementById("chooseTickets");
const randomTicketsBtn = document.getElementById("randomTickets");
const payButton = document.getElementById("payButton");
const selectedTicketsBox = document.getElementById("selectedTicketsBox");

const PRICE_PER_TICKET = 150;

let takenTickets = []; // Занятые билеты
let selectedTickets = []; // Выбранные билеты пользователем

// Функция загрузки занятых билетов с сервера и отрисовки списка
async function loadTickets() {
  try {
    const res = await fetch('http://localhost:3000/taken-tickets');
    const data = await res.json();
    takenTickets = data.taken || [];

    ticketList.innerHTML = ''; // Очищаем список

    for (let i = 1; i <= 300; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = Билет №${i};
      if (takenTickets.includes(i)) {
        option.disabled = true;
        option.textContent += " (занят)";
      }
      ticketList.appendChild(option);
    }
  } catch (e) {
    alert('Ошибка загрузки занятых билетов');
  }
}

// Обновление цены и отображение выбранных билетов
function updateTotalAndDisplay() {
  selectedTickets = Array.from(ticketList.selectedOptions).map(opt => Number(opt.value));
  selectedTicketsBox.textContent = selectedTickets.length > 0 
    ? Выбраны билеты: ${selectedTickets.join(', ')} 
    : 'Билеты не выбраны';
  totalPrice.textContent = selectedTickets.length * PRICE_PER_TICKET;
}

// Слушатель кнопки выбора билетов — просто раскрываем список
chooseTicketsBtn.addEventListener("click", () => {
  ticketList.size = 10;
  ticketList.focus();
});

// Случайный выбор билетов (только свободных)
randomTicketsBtn.addEventListener("click", () => {
  const count = parseInt(ticketCountInput.value);
  if (count < 1 || count > 300) {
    alert('Введите корректное количество билетов');
    return;
  }

  const availableTickets = [];
  for (let i = 1; i <= 300; i++) {
    if (!takenTickets.includes(i)) {
      availableTickets.push(i);
    }
  }

  if (count > availableTickets.length) {
    alert('Недостаточно свободных билетов');
    return;
  }

  const selected = new Set();
  while (selected.size < count) {
    const rand = availableTickets[Math.floor(Math.random() * availableTickets.length)];
    selected.add(rand);
  }

  Array.from(ticketList.options).forEach(option => {
    option.selected = selected.has(Number(option.value));
  });

  updateTotalAndDisplay();
});

// При изменении выбора вручную обновляем отображение и сумму
ticketList.addEventListener("change", updateTotalAndDisplay);
ticketCountInput.addEventListener("input", updateTotalAndDisplay);

// Обработка нажатия на кнопку «Оплатить»
payButton.addEventListener('click', async () => {
  if (selectedTickets.length === 0) {
    alert('Выберите билеты для оплаты');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tickets: selectedTickets }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Билеты успешно забронированы: ' + selectedTickets.join(', '));
      await loadTickets();
      selectedTickets = [];
      updateTotalAndDisplay();
    } else {
      alert('Ошибка бронирования: ' + (data.error || 'Неизвестная ошибка'));
      await loadTickets();
      selectedTickets = [];
      updateTotalAndDisplay();
    }
  } catch (e) {
    alert('Ошибка при подключении к серверу');
  }
});

// Загрузка билетов при загрузке страницы
loadTickets();
updateTotalAndDisplay();
