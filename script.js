const ticketCountInput = document.getElementById("ticketCount");
const ticketList = document.getElementById("ticketList");
const totalPrice = document.getElementById("totalPrice");
const chooseTicketsBtn = document.getElementById("chooseTickets");
const randomTicketsBtn = document.getElementById("randomTickets");

const PRICE_PER_TICKET = 150;

let takenTickets = []; // сюда будем загружать занятые билеты

async function loadTakenTickets() {
  try {
    const res = await fetch('http://localhost:3000/taken-tickets'); // или твой URL сервера
    const data = await res.json();
    takenTickets = data.taken; // ожидаем, что сервер вернёт { taken: [1, 2, 3] }

    fillTicketList();
  } catch (e) {
    alert('Ошибка загрузки занятых билетов');
    fillTicketList(); // всё равно показываем билеты без disabled
  }
}

function fillTicketList() {
  ticketList.innerHTML = ''; // очищаем список

  for (let i = 1; i <= 300; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = Билет №${i};

    if (takenTickets.includes(i)) {
      option.disabled = true;
      option.textContent += ' (занят)';
    }

    ticketList.appendChild(option);
  }
}

// Обновление цены
function updateTotal() {
  const selectedOptions = Array.from(ticketList.selectedOptions);
  totalPrice.textContent = selectedOptions.length * PRICE_PER_TICKET;
}

// Слушатель выбора билетов
chooseTicketsBtn.addEventListener("click", () => {
  const count = parseInt(ticketCountInput.value);
  ticketList.size = 10;
  ticketList.focus();
});

// Случайный выбор билетов
randomTicketsBtn.addEventListener("click", () => {
  const count = parseInt(ticketCountInput.value);
  const selected = new Set();

  // Создаём список доступных билетов (без занятых)
  const availableTickets = [];
  for(let i = 1; i <= 300; i++) {
    if (!takenTickets.includes(i)) availableTickets.push(i);
  }

  if (count > availableTickets.length) {
    alert('Недостаточно доступных билетов');
    return;
  }

  while (selected.size < count) {
    const rand = availableTickets[Math.floor(Math.random() * availableTickets.length)];
    selected.add(rand);
  }

  Array.from(ticketList.options).forEach(option => {
    option.selected = selected.has(parseInt(option.value));
  });

  updateTotal();
});

// Обработчики изменений выбора и ввода
ticketList.addEventListener("change", updateTotal);
ticketCountInput.addEventListener("input", updateTotal);

// Загружаем занятые билеты при старте
loadTakenTickets();
