let clientsDB = JSON.parse(localStorage.getItem('crunch_clients')) || {};
let currentPhone = "";
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  renderStamps(0);

  const cartBtn = document.getElementById("cart-btn");
  const cartModal = document.getElementById("cart-modal");
  const closeCart = document.getElementById("close-cart");

  cartBtn.addEventListener("click", () => cartModal.style.display = "flex");
  closeCart.addEventListener("click", () => cartModal.style.display = "none");
});

// El cliente consulta sus sellos por su teléfono
function loginClient() {
  const phoneInput = document.getElementById("client-phone").value.trim();
  if (!phoneInput) {
    alert("Por favor ingresa un número de teléfono.");
    return;
  }

  currentPhone = phoneInput;

  // Si el cliente no existe, se crea con 0 sellos
  if (!clientsDB[currentPhone]) {
    clientsDB[currentPhone] = { name: "Cliente", stamps: 0 };
    saveDB();
  }

  const client = clientsDB[currentPhone];
  renderStamps(client.stamps);
  document.getElementById("stamps-status-text").innerText = `¡Hola! Tienes ${client.stamps} de 10 Sellos acumulados.`;
}

// Coloca los sellos encima de la foto de tu tarjeta
function renderStamps(stampsCount) {
  const grid = document.getElementById("stamps-grid");
  grid.innerHTML = "";

  for (let i = 1; i <= 10; i++) {
    const slot = document.createElement("div");
    slot.classList.add("stamp-slot");
    if (i <= stampsCount) {
      slot.classList.add("active");
    }
    grid.appendChild(slot);
  }
}

// CARRITO Y PEDIDOS
function addToCart(name, price) {
  const item = cart.find(i => i.name === name);
  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  cartCount.innerText = totalQty;
  cartTotal.innerText = `$${totalPrice} MXN`;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-msg">Tu carrito está vacío</p>`;
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
        <span>${item.name} (x${item.qty})</span>
        <span>$${item.price * item.qty} MXN</span>
      </div>
    `).join("");
  }
}

function processCheckout() {
  if (cart.length === 0) return alert("Tu carrito está vacío");
  alert("¡Pedido realizado con éxito! Tu pedido se registrará para asignar tu sello.");
  cart = [];
  updateCartUI();
  document.getElementById("cart-modal").style.display = "none";
}

// TU PANEL PARA PONER SELLOS
function openAdminModal() {
  const pass = prompt("Ingresa la clave de Administrador de Crunch & Munch:");
  if (pass === "1234") {
    document.getElementById("admin-modal").style.display = "flex";
    renderAdminList();
  } else {
    alert("Clave incorrecta.");
  }
}

function closeAdminModal() {
  document.getElementById("admin-modal").style.display = "none";
}

function renderAdminList() {
  const container = document.getElementById("admin-clients-list");
  container.innerHTML = "";

  if (Object.keys(clientsDB).length === 0) {
    container.innerHTML = "<p>Aún no hay clientes registrados.</p>";
    return;
  }

  Object.keys(clientsDB).forEach(phone => {
    const client = clientsDB[phone];
    const div = document.createElement("div");
    div.classList.add("admin-client-item");
    div.innerHTML = `
      <div>
        <strong>📱 ${phone}</strong><br>
        <small>Sellos: ${client.stamps} / 10</small>
      </div>
      <button class="btn-stamp" onclick="addStampFromAdmin('${phone}')">+ 1 Sello 🍪</button>
    `;
    container.appendChild(div);
  });
}

function addStampFromAdmin(phone) {
  if (clientsDB[phone]) {
    if (clientsDB[phone].stamps < 10) {
      clientsDB[phone].stamps++;
      saveDB();
      renderAdminList();

      if (currentPhone === phone) {
        renderStamps(clientsDB[phone].stamps);
        document.getElementById("stamps-status-text").innerText = `¡Hola! Tienes ${clientsDB[phone].stamps} de 10 Sellos acumulados.`;
      }
    } else {
      alert("Este cliente ya completó sus 10 sellos y ganó su Cajita Sorpresa.");
    }
  }
}

function saveDB() {
  localStorage.setItem('crunch_clients', JSON.stringify(clientsDB));
}
