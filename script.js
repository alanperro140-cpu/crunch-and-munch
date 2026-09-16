let cart = [];
let currentStamps = 6; // Simulación inicial de sellos

document.addEventListener("DOMContentLoaded", () => {
  renderStamps();

  // Abrir y cerrar carrito
  const cartBtn = document.getElementById("cart-btn");
  const cartModal = document.getElementById("cart-modal");
  const closeCart = document.getElementById("close-cart");

  cartBtn.addEventListener("click", () => cartModal.style.display = "flex");
  closeCart.addEventListener("click", () => cartModal.style.display = "none");

  // Formulario de sabores
  const flavorForm = document.getElementById("flavor-form");
  flavorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("flavor-input");
    if (input.value.trim() !== "") {
      const votesList = document.querySelector("#votes-list ul");
      const li = document.createElement("li");
      li.innerHTML = `${input.value} <span>🔥 1 voto</span>`;
      votesList.appendChild(li);
      input.value = "";
    }
  });
});

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

function renderStamps() {
  const grid = document.getElementById("stamps-grid");
  grid.innerHTML = "";
  
  for (let i = 1; i <= 10; i++) {
    const stamp = document.createElement("div");
    stamp.classList.add("stamp");
    if (i <= currentStamps) {
      stamp.classList.add("active");
      stamp.innerText = "🍪";
    } else if (i === 10) {
      stamp.innerText = "🎁";
    }
    grid.appendChild(stamp);
  }
}
