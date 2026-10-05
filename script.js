let cart = [];

// Función para cambiar de pestañas estilo App
function switchTab(tabId, element) {
  // Ocultar todas las pestañas
  document.querySelectorAll('.app-tab').forEach(tab => {
    tab.classList.remove('active');
    // Reiniciar animación para que siempre se mueva al entrar
    tab.classList.remove('slide-up'); 
    void tab.offsetWidth; 
    tab.classList.add('slide-up');
  });
  
  // Quitar clase 'active' de todos los botones de abajo
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  // Mostrar pestaña seleccionada
  document.getElementById(tabId).classList.add('active');
  if (element) element.classList.add('active');
  
  // Si fue por el botón del carrito de arriba, iluminar el botón del carrito abajo
  if(tabId === 'tab-carrito') {
    document.querySelectorAll('.nav-item')[2].classList.add('active');
  }
}

// 1. Agregar Galletas Normales del Menú
function addToCart(name, price) {
  // Buscar si ya está en el carrito para sumarle 1 en lugar de repetirla
  const item = cart.find(i => i.name === name && !i.isCustom);
  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1, isCustom: false, details: "" });
  }
  updateCartUI();
  
  // Animación del carrito saltando
  const cartBtn = document.querySelector('.cart-badge-btn');
  cartBtn.style.transform = 'scale(1.2)';
  setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
}

// 2. Agregar Galleta Personalizada (Arma tu Galleta)
function addCustomCookie(e) {
  e.preventDefault();
  const form = e.target;
  
  // Obtener la Base (Radio)
  const baseEl = form.querySelector('input[name="base"]:checked');
  if(!baseEl) {
    alert("¡Por favor elige una base para tu galleta!");
    return;
  }
  const base = baseEl.value;
  
  // Obtener los Rellenos (Checkboxes)
  const rellenos = Array.from(form.querySelectorAll('input[name="relleno"]:checked')).map(cb => cb.value);
  
  // Obtener las Chispas (Checkboxes)
  const chispas = Array.from(form.querySelectorAll('input[name="chispas"]:checked')).map(cb => cb.value);
  
  // Obtener Extras
  const extraEl = form.querySelector('input[name="extra"]:checked');
  const extraText = extraEl ? extraEl.value : null;

  // Lógica de "Sin Relleno" - Si marcó "Sin Relleno" junto con otros, quitamos la palabra "Sin relleno" para que no suene ilógico.
  let rellenosFinales = rellenos;
  if (rellenos.includes("Sin Relleno") && rellenos.length > 1) {
    rellenosFinales = rellenos.filter(r => r !== "Sin Relleno");
  } else if (rellenos.length === 0) {
    rellenosFinales = ["Sin Relleno"];
  }

  // Costo: base galleta = $50 MXN (puedes ajustar)
  let price = 50; 
  if (extraText) {
    price += 20; // Si pide nieve, suma $20
  }

  // Armar el texto descriptivo
  let detailsArr = [];
  detailsArr.push(`Base: ${base}`);
  detailsArr.push(`Relleno: ${rellenosFinales.join(', ')}`);
  if (chispas.length > 0) detailsArr.push(`Toppings: ${chispas.join(', ')}`);
  if (extraText) detailsArr.push(`Extra: Nieve de Vainilla`);

  const detailsString = detailsArr.join(' | ');

  // Meter al carrito
  cart.push({
    name: `Galleta Personalizada ✨`,
    price: price,
    qty: 1,
    isCustom: true,
    details: detailsString
  });

  updateCartUI();
  alert("¡Tu galleta creativa fue agregada al carrito! 🍪");
  form.reset(); // Limpiar el formulario para la siguiente
}

// 3. Actualizar la vista del Carrito
function updateCartUI() {
  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // Actualizar la bolita del carrito arriba
  document.getElementById("cart-count").innerText = totalQty;
  document.getElementById("cart-total").innerText = `$${totalPrice} MXN`;

  const container = document.getElementById("cart-items");
  const summaryBox = document.getElementById("cart-summary-box");

  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-msg">Tu carrito está vacío. ¡Ve a agregar unas deliciosas galletas!</p>`;
    summaryBox.style.display = "none";
  } else {
    summaryBox.style.display = "block";
    
    // Crear el HTML por cada producto guardado
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.qty}x ${item.name}</div>
          ${item.isCustom ? `<div class="cart-item-desc">${item.details}</div>` : ''}
        </div>
        <div class="cart-item-price">$${item.price * item.qty}</div>
      </div>
    `).join("");
  }
}

// 4. Enviar el pedido (Simulación o WhatsApp)
function processCheckout() {
  if (cart.length === 0) return;

  // Creamos un mensaje bonito para WhatsApp
  let mensaje = `Hola Crunch & Munch, quiero hacer el siguiente pedido:\n\n`;
  
  cart.forEach(item => {
    mensaje += `▪️ ${item.qty}x ${item.name} - $${item.price * item.qty}\n`;
    if(item.isCustom) {
      mensaje += `   (${item.details})\n`;
    }
  });

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  mensaje += `\n*TOTAL A PAGAR: $${totalPrice} MXN*`;

  // Cambia ESTE NÚMERO por tu teléfono real de Crunch & Munch con el prefijo de país (ej. 523310677989)
  const tuNumeroWhatsApp = "523310677989"; 
  const urlWhatsApp = `https://wa.me/${tuNumeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  
  // Abre WhatsApp con el mensaje precargado
  window.open(urlWhatsApp, "_blank");

  // Vaciar carrito después de enviar
  cart = [];
  updateCartUI();
  switchTab('tab-inicio');
}
