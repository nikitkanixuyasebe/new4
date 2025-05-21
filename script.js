// script.js
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
  option.textContent = `Билет №${i}`;
  ticketList.appendChild(option);
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

  while (selected.size < count) {
    const rand = Math.floor(Math.random() * 300) + 1;
    selected.add(rand);
  }

  Array.from(ticketList.options).forEach(option => {
    option.selected = selected.has(parseInt(option.value));
  });

  updateTotal();
});

// При изменении выбора вручную
ticketList.addEventListener("change", updateTotal);
ticketCountInput.addEventListener("input", updateTotal);
