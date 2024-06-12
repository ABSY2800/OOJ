class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

class ShoppingCartItem {
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
  }

  getTotalPrice() {
    return this.product.price * this.quantity;
  }
}

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(product, quantity) {
    const existingItem = this.items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem = new ShoppingCartItem(product, quantity);
      this.items.push(newItem);
    }
    this.renderCart();
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.renderCart();
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice() {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }

  renderCart() {
    const cartItemsElement = document.getElementById('item-list');
    cartItemsElement.innerHTML = '';

    this.items.forEach(item => {
      const cartItemElement = document.createElement('li');
      cartItemElement.dataset.id = item.product.id;
      cartItemElement.dataset.price = item.product.price;
      cartItemElement.innerHTML = `
        <img src="https://via.placeholder.com/50" alt="${item.product.name}">
        <span>${item.product.name}</span>
        <span>Prix: ${item.product.price} XOF</span>
        <button class="remove">Supprimer</button>
        <span class="quantity">${item.quantity}</span>
        <button class="minus">-</button>
        <button class="plus">+</button>
        <button class="like">❤</button>
      `;
      cartItemsElement.appendChild(cartItemElement);
    });

    this.updateTotalPrice();
  }

  updateTotalPrice() {
    const totalPriceDisplay = document.getElementById('total-price');
    const totalPrice = this.getTotalPrice();
    totalPriceDisplay.textContent = totalPrice.toFixed(2);
  }

  increaseQuantity(itemElement) {
    const itemId = parseInt(itemElement.dataset.id);
    const item = this.items.find(item => item.product.id === itemId);
    if (item) {
      item.quantity++;
      this.renderCart();
    }
  }

  decreaseQuantity(itemElement) {
    const itemId = parseInt(itemElement.dataset.id);
    const item = this.items.find(item => item.product.id === itemId);
    if (item && item.quantity > 1) {
      item.quantity--;
      this.renderCart();
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const itemList = document.getElementById('item-list');

  itemList.addEventListener('click', function(e) {
    const itemElement = e.target.closest('li');
    if (!itemElement) return;

    if (e.target.classList.contains('minus')) {
      cart.decreaseQuantity(itemElement);
    } else if (e.target.classList.contains('plus')) {
      cart.increaseQuantity(itemElement);
    } else if (e.target.classList.contains('remove')) {
      const itemId = parseInt(itemElement.dataset.id);
      cart.removeItem(itemId);
    } else if (e.target.classList.contains('like')) {
      e.target.classList.toggle('liked');
    }
  });

  // Sample products
  const products = [
    new Product(1, 'HERMES BURKIN', 25000),
    new Product(2, 'LOUIS VUITTON', 20000),
    new Product(3, 'FENDI', 15000)
  ];

  // Create a cart instance
  const cart = new ShoppingCart();

  // Function to render products
  function renderProducts() {
    const productListElement = document.getElementById('product-list');
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'product';
      productElement.innerHTML = `
        <span>${product.name} - XOF{product.price}</span>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      `;
      productListElement.appendChild(productElement);
    });

    // Add event listeners to "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
        const productId = parseInt(this.dataset.id);
        const product = products.find(product => product.id === productId);
        cart.addItem(product, 1);
      });
    });
  }

  // Initial rendering
  renderProducts();
});
