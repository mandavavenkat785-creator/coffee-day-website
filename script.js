document.addEventListener("DOMContentLoaded", () => {
const navLinks = document.querySelectorAll(".nav-menu .nav-link");
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");
const cart = {};
const cartTable = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const confirmOrderBtn = document.getElementById("confirm-order");
const orderMsg = document.getElementById("order-message");

document.addEventListener('DOMContentLoaded', () => {
  const loggedInUser = localStorage.getItem('user');
  if (!loggedInUser) {
    window.location.href = 'login.html';
  }
  renderOrderHistory(); // Load history on page load
});


 
    document.addEventListener('DOMContentLoaded', () => {
        const loggedInUser = localStorage.getItem('user'); // or your key
        if (!loggedInUser) {
        // If user is NOT logged in, redirect to login.html
        window.location.href = 'login.html';
        }
    });


menuOpenButton.addEventListener("click", () => {
    //toggle mobile visibility
    document.body.classList.toggle("show-mobile-menu");
});

// close menu when the close button is clicked
menuCloseButton.addEventListener("click", () => menuOpenButton.click());

// close menu when the nav link is clicked
navLinks.forEach(link => {
    link.addEventListener("click", () => menuOpenButton.click());
});

// initialize swiper
const swiper = new Swiper('.slider-wrapper', {
  loop: true,
  grabCursor: true,
  spaceBetween: 25,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets:true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  
  // responsive breakpoints
  breakpoints: {
    0: {
        slidesPerView: 1
    },
    768: {
        slidesPerView: 2
    },
    1024: {
        slidesPerView: 3
    }
  }
});

// Add to Cart logic
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = parseInt(button.dataset.price);

    // First time add
    if (!cart[name]) {
      cart[name] = { price: price, quantity: 1 };

      // Create quantity selector UI
      const container = document.createElement("div");
      container.classList.add("quantity-control");

      const minus = document.createElement("button");
      minus.textContent = "-";
      minus.classList.add("qty-btn");

      const qtyDisplay = document.createElement("span");
      qtyDisplay.textContent = "1";
      qtyDisplay.classList.add("qty-number");

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.classList.add("qty-btn");

      // Add listeners
      minus.addEventListener("click", () => {
        if (cart[name].quantity > 1) {
          cart[name].quantity--;
          qtyDisplay.textContent = cart[name].quantity;
        } else {
          delete cart[name];
          container.replaceWith(button); // restore Add to Cart
        }
        updateCartDisplay();
      });

      plus.addEventListener("click", () => {
        cart[name].quantity++;
        qtyDisplay.textContent = cart[name].quantity;
        updateCartDisplay();
      });

      container.append(minus, qtyDisplay, plus);
      button.replaceWith(container);
    } else {
      cart[name].quantity++;
      document.querySelector(`.qty-number`).textContent = cart[name].quantity;
    }

    updateCartDisplay();
  });
});

// Update cart table
function updateCartDisplay() {
  cartTable.innerHTML = "";
  let total = 0;

  for (const name in cart) {
    const item = cart[name];
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name} (${item.quantity})</td>
      <td>₹${itemTotal}</td>
      <td><button onclick="removeItem('${name}')">Remove</button></td>
    `;
    cartTable.appendChild(row);
  }

  cartTotal.textContent = total;
  confirmOrderBtn.style.display = total ? "block" : "none";
  orderMsg.textContent = "";
}

window.removeItem = function(name) {
  // Remove from cart
  delete cart[name];

  // Restore "Add to Cart" in menu
  const allButtons = document.querySelectorAll(`[data-name="${name}"]`);
  allButtons.forEach(btn => {
    const price = btn.getAttribute("data-price");
    const newButton = createAddToCartButton(name, price);
    btn.parentElement.replaceChild(newButton, btn.parentElement.querySelector('.quantity-control'));
  });

  updateCartDisplay();
};


//LOGOUT
const logoutBtn = document.getElementById('logout-button');

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('user'); // or 'token' if that's the key you use
  window.location.href = 'login.html'; // redirect to login page
});


// Confirm Order
confirmOrderBtn.addEventListener("click", () => {
  if (!Object.keys(cart).length) return;

  const user = localStorage.getItem('user');
  if (!user) return;

  const historyKey = `orderHistory_${user}`;
  const items = Object.entries(cart).map(([name, item]) => `${name} x${item.quantity}`);
  const total = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);

  const history = JSON.parse(localStorage.getItem(historyKey) || "[]");

  history.push({
    date: new Date().toLocaleString(),
    items: items.join(", "),
    total: `₹${total}`
  });

  localStorage.setItem(historyKey, JSON.stringify(history));
  renderOrderHistory();

  alert("🎉 Your order has been confirmed!");
  for (const key in cart) delete cart[key];
  updateCartDisplay();
});



function renderOrderHistory() {
  const user = localStorage.getItem('user');
  if (!user) return;

  const table = document.getElementById("order-history-items");
  if (!table) return;

  const historyKey = `orderHistory_${user}`;
  const history = JSON.parse(localStorage.getItem(historyKey) || "[]");

  table.innerHTML = "";

  history.reverse().forEach(order => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.date}</td>
      <td>${order.items}</td>
      <td>${order.total}</td>
    `;
    table.appendChild(row);
  });
}




const form = document.getElementById('reviewForm');

form.addEventListener('submit', async (event) => {
  event.preventDefault(); // prevent page reload

  // Prepare data to send
  const formData = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value
  };

  try {
    const response = await fetch('http://localhost:5000/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      console.log('Response OK');
      alert('Review submitted successfully!');
      form.reset();
    } else {
      console.log('Response NOT OK');
      alert('Failed to submit review.');
    }

  } catch (error) {
    // network or other error
    console.error('Error submitting review:', error);
    alert('Error submitting review.');
  }
});

});
