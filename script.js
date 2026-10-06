let cart = [];

function switchTab(tabId, element) {
  document.querySelectorAll('.app-tab').forEach(tab => {
    tab.classList.remove('active');
    tab.classList.remove('slide-up'); 
    void tab.offsetWidth; 
    tab.classList.add('slide-up');
  });
  
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  if (element) element.classList.add('active');
  
  if(tabId === 'tab-carrito') {
    document.querySelectorAll('.nav-item')[2].classList.add('active');
  }
}

// Agregar Galletas con Precio Único ($30 o $40)
function addToCart(name, price) {
  const item = cart.find(i => i.name === name && !i.isCustom);
  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1, isCustom: false, details: "" });
  }
  updateCartUI();
  animateCartBtn();
}

// Agregar Galletas con Selector de Tamaño (Clásica y Arándanos)
function addSizedToCart(baseName, selectId) {
  const selectElement = document.getElementById(selectId);
  // El valor del select viene como "Tamaño|Precio", ej: "Grande|25" o "Mini|15"
  const [size, priceStr] = selectElement.value.split('|');
  const price = parseInt(priceStr);
  const fullName = `${baseName} (${size})`;

  const item = cart.find(i => i.name === fullName && !i.isCustom);
  if (item) {
    item.qty++;
  } else {
    cart.push({ name: fullName, price: price, qty: 1, isCustom: false, details: "" });
  }
  updateCartUI();
  animateCartBtn();
}

function animateCartBtn() {
  const cartBtn = document.querySelector('.cart-badge-btn');
  cartBtn.style.transform = 'scale(1.1)';
  setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
}

// Armar Galleta
function addCustomCookie(e) {
  e.preventDefault();
  const form = e.target;
  
  const baseEl = form.querySelector('input[name="base"]:checked');
  if(!baseEl) {
    alert("¡Por favor elige una base para tu galleta!");
    return;
  }
  const base = baseEl.value;
  
  const rellenos = Array.from(form.querySelectorAll('input[name="relleno"]:checked')).map(cb => cb.value);
  const chispas = Array.from(form.querySelectorAll('input[name="chispas"]:checked')).map(cb => cb.value);
  
  const extraEl = form.querySelector('input[name="extra"]:checked');
  const extraText = extraEl ? extraEl.value : null;

  let rellenosFinales = rellenos;
  if (rellenos.includes("Sin Relleno") && rellenos.length > 1) {
    rellenosFinales = rellenos.filter(r => r !== "Sin Relleno");
  } else if (rellenos.length === 0) {
    rellenosFinales = ["Sin Relleno"];
  }

  // Costo Base de Galleta Creada (La ajusté a $30 como base para que cuadre con tu menú, pero la puedes cambiar)
  let price = 30; 
  if (extraText) {
    price += 5; // Nieve ahora vale 5 pesos
  }

  let detailsArr = [];
  detailsArr.push(`Base: ${base}`);
  detailsArr.push(`Relleno: ${rellenosFinales.join(', ')}`);
  if (chispas.length > 0) detailsArr.push(`Toppings: ${chispas.join(', ')}`);
  if (extraText) detailsArr.push(`Extra: Nieve de Vainilla`);

  const detailsString = detailsArr.join(' | ');

  cart.push({
    name: `Galleta de Autor ✨`,
    price: price,
    qty: 1,
    isCustom: true,
    details: detailsString
  });

  updateCartUI();
  alert("¡Tu galleta creativa fue agregada a la orden!");
  form.reset();
}

function updateCartUI() {
  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  document.getElementById("cart-count").innerText = totalQty;
  document.getElementById("cart-total").innerText = `$${totalPrice} MXN`;

  const container = document.getElementById("cart-items");
  const summaryBox = document.getElementById("cart-summary-box");

  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-msg">Tu bolsa de compras está vacía.</p>`;
    summaryBox.style.display = "none";
  } else {
    summaryBox.style.display = "block";
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div style="max-width: 75%;">
          <div class="cart-item-title">${item.qty}x ${item.name}</div>
          ${item.isCustom ? `<div class="cart-item-desc">${item.details}</div>` : ''}
        </div>
        <div class="cart-item-price">$${item.price * item.qty}</div>
      </div>
    `).join("");
  }
}

// Botón de WhatsApp
function processCheckout() {
  if (cart.length === 0) return;

  let mensaje = `¡Hola Crunch & Munch! 🍪\nQuiero confirmar el siguiente pedido:\n\n`;
  
  cart.forEach(item => {
    mensaje += `▪️ ${item.qty}x ${item.name} - $${item.price * item.qty}\n`;
    if(item.isCustom) {
      mensaje += `   (${item.details})\n`;
    }
  });

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  mensaje += `\n*TOTAL A PAGAR: $${totalPrice} MXN*`;

  // El nuevo número de WhatsApp solicitado
  const tuNumeroWhatsApp = "523316939960"; 
  const urlWhatsApp = `https://wa.me/${tuNumeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  
  window.open(urlWhatsApp, "_blank");

  cart = [];
  updateCartUI();
  switchTab('tab-inicio');
}
