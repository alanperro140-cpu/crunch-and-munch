let currentUser = JSON.parse(localStorage.getItem('crunch_user')) || null;
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  if (currentUser) {
    document.getElementById("login-overlay").style.display = "none";
    document.getElementById("app-content").style.display = "block";
    document.getElementById("display-user-name").innerText = currentUser.name;
    renderStamps(currentUser.stamps || 0);
  }
});

function handleLogin(e) {
  e.preventDefault();
  const name = document.getElementById("user-name-input").value.trim();
  const phone = document.getElementById("user-phone-input").value.trim();

  if (name && phone) {
    currentUser = { name, phone, stamps: 0 };
    localStorage.setItem('crunch_user', JSON.stringify(currentUser));

    document.getElementById("login-overlay").style.display = "none";
    document.getElementById("app-content").style.display = "block";
    document.getElementById("display-user-name").innerText = currentUser.name;
    renderStamps(0);
  }
}

function switchTab(tabId, element) {
  document.querySelectorAll('.app-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  if (element) element.classList.add('active');
}

function addToCart(name, price) {
  const item = cart.find(i => i.name === name);
  if (item) item.qty++;
  else cart.push({ name, price, qty: 1 });
  updateCartUI();
}

function updateCartUI() {
  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  document.getElementById("cart-count").innerText = totalQty;
  document.getElementById("cart-total").innerText = `$${totalPrice} MXN`;

  const container = document.getElementById("cart-items");
  const summaryBox = document.getElementById("cart-summary-box");

  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-msg">Tu carrito está vacío</p>`;
    summaryBox.style.display = "none";
  } else {
    summaryBox.style.display = "block";
    container.innerHTML = cart.map(item => `
      <div class="cart-item-row">
        <span>${item.name} (x${item.qty})</span>
        <span>$${item.price * item.qty} MXN</span>
      </div>
    `).join("");
  }
}

function togglePaymentOptions(method) {
  const efectivoPanel = document.getElementById("efectivo-details");
  const tarjetaPanel = document.getElementById("tarjeta-details");

  if (method === 'efectivo') {
    efectivoPanel.style.display = "block";
    tarjetaPanel.style.display = "none";
  } else {
    efectivoPanel.style.display = "none";
    tarjetaPanel.style.display = "block";
  }
}

function processCheckout() {
  if (cart.length === 0) return;

  const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
  let paymentDetails = "";

  if (paymentMethod === "efectivo") {
    const monto = document.getElementById("efectivo-monto").value || "Pago exacto";
    paymentDetails = `Efectivo (${monto})`;
  } else {
    const platform = document.getElementById("digital-platform-select").value;
    paymentDetails = `Pago Digital (${platform})`;
  }

  const itemsText = cart.map(i => `${i.qty}x ${i.name}`).join(', ');

  alert(`¡Gracias por tu pedido, ${currentUser.name}!\n\nResumen: ${itemsText}\nMétodo de Pago: ${paymentDetails}\n\nNotificación enviada a Crunch & Munch.`);

  cart = [];
  updateCartUI();
  switchTab('tab-perfil');
}

function submitFlavor(e) {
  e.preventDefault();
  const name = document.getElementById("flavor-name").value.trim();
  const details = document.getElementById("flavor-details").value.trim();

  if (name && details) {
    const ul = document.getElementById("flavor-list");
    const emptyMsg = ul.querySelector('.empty-list-msg');
    if (emptyMsg) emptyMsg.remove();

    const li = document.createElement("li");
    li.innerText = `💡 ${name} (${details})`;
    ul.appendChild(li);

    alert("¡Sugerencia enviada con éxito! La tomaremos en cuenta para la receta de la semana.");

    document.getElementById("flavor-name").value = "";
    document.getElementById("flavor-details").value = "";
  }
}

function renderStamps(stampsCount) {
  const grid = document.getElementById("stamps-grid");
  grid.innerHTML = "";
  for (let i = 1; i <= 10; i++) {
    const slot = document.createElement("div");
    slot.classList.add("stamp-slot");
    if (i <= stampsCount) slot.classList.add("active");
    grid.appendChild(slot);
  }
  document.getElementById("stamps-status-text").innerText = `${stampsCount} / 10 SELLOS ACUMULADOS`;
}
