const ticketCountInput = document.getElementById("ticketCount");
const ticketList = document.getElementById("ticketList");
const totalPrice = document.getElementById("totalPrice");
const chooseTicketsBtn = document.getElementById("chooseTickets");
const randomTicketsBtn = document.getElementById("randomTickets");

const PRICE_PER_TICKET = 150;

let takenTickets = [];

// Функция для загрузки занятых билетов и отрисовки списка
async function loadTakenTickets() {
  try {
    const res = await fetch('http://localhost:3000/taken-tickets');
    const data = await res.json();
    takenTickets = data.taken || [];

    ticketList.innerHTML = '';
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

// Обновляем общую сумму
function updateTotal() {
  const selectedOptions = Array.from(ticketList.selectedOptions)
    .filter(opt => !opt.disabled);
  totalPrice.textContent = selectedOptions.length * PRICE_PER_TICKET;
}

// Кнопка «Выбрать билет(ы)»
chooseTicketsBtn.addEventListener("click", () => {
  const count = parseInt(ticketCountInput.value);
  ticketList.size = 10;
  ticketList.focus();
});

// Кнопка «Рандомные билеты»
randomTicketsBtn.addEventListener("click", () => {
  const count = parseInt(ticketCountInput.value);
  if (count < 1 || count > 300) {
    alert("Введите корректное количество билетов");
    return;
  }

  // Доступные билеты
  const availableTickets = [];
  Array.from(ticketList.options).forEach(opt => {
    if (!opt.disabled) availableTickets.push(parseInt(opt.value));
  });

  if (count > availableTickets.length) {
    alert("Недостаточно свободных билетов");
    return;
  }

  // Случайный выбор
  const selected = new Set();
  while (selected.size < count) {
    const rand = availableTickets[Math.floor(Math.random() * availableTickets.length)];
    selected.add(rand);
  }

  // Отметить выбранные
  Array.from(ticketList.options).forEach(opt => {
    opt.selected = selected.has(parseInt(opt.value));
  });

  updateTotal();
});

// При изменении выбора вручную обновляем сумму
ticketList.addEventListener("change", updateTotal);
ticketCountInput.addEventListener("input", updateTotal);

// Загрузить билеты при старте
loadTakenTickets();
updateTotal();
