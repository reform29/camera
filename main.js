let cart = [];
let cartCount = 0;

function openSlidePage() {
    document.getElementById("slide-page").classList.add("open");
    document.getElementById("mobile-cart-panel").classList.add("open");
    document.body.classList.add("modal-open");
    updateCartVisibility();
}

function updateCartVisibility() {
    if (cart.length === 0) {
        document.querySelector(".cart").style.display = "none";
        document.getElementById("mobile-cart-panel").classList.remove("open");
    } else {
        document.querySelector(".cart").style.display = "block";
        document.getElementById("mobile-cart-panel").classList.add("open");
    }
}

// Close slide page button
document.getElementById("close-page-btn").onclick = function () {
    document.getElementById("slide-page").classList.remove("open");
    document.getElementById("mobile-cart-panel").classList.remove("open");
    document.body.classList.remove("modal-open");
};

// Attach event listeners to buttons that should open the slide page
document.querySelectorAll(".servicebuynow").forEach(button => {
    button.addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("slide-page").classList.add("open");
        document.getElementById("mobile-cart-panel").classList.add("open");
        document.body.classList.add("modal-open");
        updateCartVisibility();
        document.getElementById("serviceFormModal").style.display = "none";
    });
});

document.querySelectorAll(".service-item").forEach(button => {
    if (!button.classList.contains("servicebuynow")) {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            // Store the service name when the button is clicked
            const serviceName = this.querySelector('h3').textContent;
            openServiceForm(serviceName);
            document.getElementById("slide-page").classList.remove("open");
            document.getElementById("mobile-cart-panel").classList.remove("open");
            document.body.classList.remove("modal-open");
        });
    }
});

// Service Form Functions
let selectedservice = '';

function openServiceForm(servicename) {
    selectedservice = servicename;
    document.getElementById("serviceFormModal").style.display = "block";
    document.body.classList.add("modal-open");

    let extraField = "";
    if (servicename === "other services" || servicename === "Camera repair") {
        extraField = `
        <label for="otherService">Issue description/Service:</label>
        <textarea name="otherService" id="otherService" required></textarea>
      `;
    }

    document.getElementById("serviceFormContainer").innerHTML = `
      <div class="form-wrapper">
        <h3>Service Request Form: ${servicename}</h3>
        <form id="serviceForm" onsubmit="sendServiceRequestToWhatsApp(event)">
          <input type="hidden" id="serviceType" value="${servicename}">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>

          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>

          <label for="Address">Address:</label>
          <input type="text" id="address" name="a=Address" required>

          <label for="phone">Phone:</label>
          <input type="tel" id="phone" name="phone" required>

          ${extraField}

          <div class="form-buttons">
            <button type="submit">Submit</button>
            <button type="button" onclick="closeServiceForm()">Cancel</button>
          </div>
        </form>
      </div>
      `;
}

function closeServiceForm() {
    document.getElementById("serviceFormModal").style.display = "none";
    document.body.classList.remove("modal-open");
}

function sendServiceRequestToWhatsApp(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const serviceType = document.getElementById("serviceType").value;
    const address = document.getElementById("address").value;
    const otherService = document.getElementById("otherService") ? document.getElementById("otherService").value : '';
    const message = `Service Request:
Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}
Service: ${serviceType}
Description: ${otherService}`;
    const whatsappUrl = `https://wa.me/919886106311?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closeServiceForm();
}

// Cart Functions
function addToCart(button) {
    const productName = button.getAttribute('data-product-name');
    const price = parseFloat(button.getAttribute('data-price').replace(/,/g, ''));
    const installationCharge = parseFloat(button.getAttribute('data-installation-charge').replace(/,/g, ''));

    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ name: productName, price, installationCharge, quantity: 1 });
    }
    updateCart();
    button.nextElementSibling.style.display = 'block';
    button.style.display = 'none';
    button.nextElementSibling.querySelector('.qty').innerText = cart.find(item => item.name === productName).quantity;
    if (cart.length > 0) {
        document.getElementById("mobile-cart-panel").classList.add("open");
    }
}

document.querySelectorAll('.qty-btn').forEach(button => {
    button.addEventListener('click', function () {
        const productName = this.parentNode.parentNode.parentNode.querySelector('.add-to-cart').getAttribute('data-product-name');
        const change = this.classList.contains('plus-btn') ? 1 : -1;
        changeQuantity(productName, change);
        this.parentNode.querySelector('.qty').innerText = cart.find(item => item.name === productName).quantity;
        if (cart.find(item => item.name === productName).quantity === 0) {
            const cartControls = this.parentNode.parentNode.parentNode.querySelector('.cart-controls');
            cartControls.querySelector('.add-to-cart').style.display = 'block';
            cartControls.querySelector('.qty-controls').style.display = 'none';
            const index = cart.findIndex(item => item.name === productName);
            if (index !== -1) {
                cart.splice(index, 1);
                updateCart();
            }
        }
    });
});

function changeQuantity(productName, change) {
    const item = cart.find(item => item.name === productName);
    if (item) {
        item.quantity += change;
        if (item.quantity < 0) {
            item.quantity = 0;
        }
        if (item.quantity === 0) {
            const index = cart.findIndex(item => item.name === productName);
            if (index !== -1) {
                cart.splice(index, 1);
            }
        }
        updateCart();
        const productCard = document.querySelector(`.product-card .add-to-cart[data-product-name="${productName}"]`);
        if (productCard) {
            if (item.quantity > 0) {
                productCard.style.display = 'none';
                productCard.nextElementSibling.style.display = 'block';
                productCard.nextElementSibling.querySelector('.qty').innerText = item.quantity;
            } else {
                productCard.style.display = 'block';
                productCard.nextElementSibling.style.display = 'none';
            }
        }
    }
}

function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const mobileCartItemsContainer = document.getElementById("mobile-cart-items");
    const cartTotal = document.getElementById("cart-total");
    const mobileCartTotal = document.getElementById("mobile-cart-total");

    cartItemsContainer.innerHTML = '';
    mobileCartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = (item.price + item.installationCharge) * item.quantity;
        total += itemTotal;

        const cartItemHTML = `
      
    `;
        cartItemsContainer.innerHTML += cartItemHTML;
        mobileCartItemsContainer.innerHTML += cartItemHTML;
    });

    cartTotal.innerText = `Total: ₹${total.toFixed(2)}`;
    mobileCartTotal.innerText = `Total: ₹${total.toFixed(2)}`;
    updateCartVisibility();
}

function removeFromCart(productName) {
    const index = cart.findIndex(item => item.name === productName);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
        const productCard = document.querySelector(`.product-card .add-to-cart[data-product-name="${productName}"]`);
        if (productCard) {
            productCard.style.display = 'block';
            productCard.nextElementSibling.style.display = 'none';
        }
    }
}

document.getElementById("slide-page").addEventListener("click", function (event) {
    if (event.target === this) {
        document.getElementById("mobile-cart-panel").classList.remove("open");
    }
});

// Add event listener to mobile cart panel button
document.getElementById("mobile-cart-panel").addEventListener("click", function (event) {
    if (event.target === this) {
        document.getElementById("mobile-cart-panel").classList.remove("open");
    }
});

// Function to open cart slide page
function openCartSlidePage() {
    document.getElementById("cart-slide-page").classList.add("open");
    document.body.classList.add("modal-open");
    updateCartSlidePage();
}

// Function to close cart slide page - FIXED to ensure modal-open is removed
function closeCartSlidePage() {
    document.getElementById("cart-slide-page").classList.remove("open");
    document.body.classList.remove("modal-open"); // Always remove modal-open class
}

// Close cart slide page button - FIXED to ensure proper closing
document.getElementById("close-cart-slide-page-btn").addEventListener("click", function() {
    closeCartSlidePage();
});


// Function to update cart slide page
function updateCartSlidePage() {
    const cartSlidePageItems = document.getElementById("cart-slide-page-items");
    const cartSlidePageTotal = document.getElementById("cart-slide-page-total");
    cartSlidePageItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = (item.price + item.installationCharge) * item.quantity;
        total += itemTotal;

        const cartItemHTML = `
      <div class="cart-item">
        <span>${item.name} (x${item.quantity})</span>
        <span>₹${item.price} (Price)</span>
        <span>₹${item.installationCharge} (Installation Charge)</span>
        <span>₹${itemTotal.toFixed(2)} (Total)</span>
      </div>
    `;
        cartSlidePageItems.innerHTML += cartItemHTML;
    });

    cartSlidePageTotal.innerText = `Total: ₹${total.toFixed(2)}`;
}

// Function to generate order summary
function generateOrderSummary() {
    let summary = "Order Summary:\n";
    let total = 0;

    cart.forEach(item => {
        const itemTotal = (item.price + item.installationCharge) * item.quantity;
        total += itemTotal;
        summary += `${item.name} (x${item.quantity}) - ₹${item.price} + ₹${item.installationCharge} (Installation) = ₹${itemTotal.toFixed(2)}\n`;
    });

    summary += `\nTotal Amount: ₹${total.toFixed(2)}`;
    return summary;
}

// Function to open form
function openForm() {
    document.getElementById("form-container").classList.add("show");
    document.body.classList.add("modal-open");
    
    // Fill the order summary with cart items
    const orderSummary = document.getElementById("order-summary");
    orderSummary.value = generateOrderSummary();
}

// Function to close form
function closeForm() {
    document.getElementById("form-container").classList.remove("show");
    document.body.classList.remove("modal-open");
}

// Function to send order details to WhatsApp
document.getElementById("order-form").addEventListener("submit", sendOrderToWhatsApp);

function sendOrderToWhatsApp(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const orderSummary = document.getElementById("order-summary").value;
    const message = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}\n${orderSummary}`;
    const whatsappUrl = `https://wa.me/919886106311?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closeForm();
}

document.addEventListener("contextmenu", (event) => event.preventDefault());
document.addEventListener("dragstart", (event) => event.preventDefault());
document.addEventListener("copy", (event) => event.preventDefault());

updateCart();
updateCartVisibility();