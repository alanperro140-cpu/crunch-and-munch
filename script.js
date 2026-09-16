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

// Guardar sesión del usuario
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

// Navegación de pestañas tipo App
function switchTab(tabId, element) {
  document.querySelectorAll('.app-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  if (element) element.classList.add('active');
}

// Dibujar sellos
function renderStamps(stampsCount) {
  const grid = document.getElementById("stamps-grid");
  grid.innerHTML = "";
  for (let i = 1; i <= 10; i++) {
    const slot = document.createElement("div");
    slot.classList.add("stamp-slot");
    if (i <= stampsCount) slot.classList.add("active");
    grid.appendChild(slot);
  }
  document.getElementById("stamps-status-text").innerText = `Tienes ${stampsCount} de 10 Sellos acumulados`;
}

// Manejo de carrito
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
  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-msg">Tu carrito está vacío</p>`;
  } else {
    container.innerHTML = cart.map(item => `
      <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
        <span>${item.name} (x${item.qty})</span>
        <span>$${item.price * item.qty} MXN</span>
      </div>
    `).join("");
  }
}

// Confirmar pedido y simular envío de notificación por correo a Alanperro140@gmail.com
function processCheckout() {
  if (cart.length === 0) return alert("Tu carrito está vacío.");

  const summary = cart.map(i => `${i.qty}x ${i.name}`).join(', ');
  alert(`¡Pedido confirmado, ${currentUser.name}!\nSe ha enviado la notificación de tu pedido a Crunch & Munch.`);
  
  cart = [];
  updateCartUI();
  switchTab('tab-perfil');
}

// Enviar sugerencia de sabor
function submitFlavor(e) {
  e.preventDefault();
  const input = document.getElementById("flavor-input");
  if (input.value.trim() !== "") {
    const ul = document.getElementById("flavor-list");
    const li = document.createElement("li");
    li.innerHTML = `${input.value} <span>🔥 1 voto</span>`;
    ul.appendChild(li);
    alert("¡Gracias! Tu sugerencia ha sido registrada.");
    input.value = "";
  }
}
