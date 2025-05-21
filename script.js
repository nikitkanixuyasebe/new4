const ticketCountInput = document.getElementById("ticketCount");
const ticketList = document.getElementById("ticketList");
const totalPrice = document.getElementById("totalPrice");
const chooseTicketsBtn = document.getElementById("chooseTickets");
const randomTicketsBtn = document.getElementById("randomTickets");

const PRICE_PER_TICKET = 150;

// Заполнить список билетов
for (let i = 1; i <= 300; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = Билет №${i}; // ← правильная строка
  ticketList.appendChild(option);
}

// Обновление цены
function updateTotal() {
  const selectedOptions = Array.from(ticketList.selectedOptions);
  totalPrice.textContent = selectedOptions.length * PRICE_PER_TICKET;
}

// Слушатель выбора билетов
chooseTicke

