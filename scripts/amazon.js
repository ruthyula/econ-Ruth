
import {cart, addToCart, calculateCartQuantity} from '../data/cart.js';
import {loadProductsFetch} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

async function renderProductsGrid() {
    try {
  const products = await loadProductsFetch();
  
let productsHTML = '';

  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');

  let filteredProducts = products;

  // If a search exists in the URL parameters,
  // filter the products that match the search.
  if (search) {
    filteredProducts = products.filter((product) => {
      return product.name.includes(search);
    });
  }
   filteredProducts.forEach((product) => {
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>
      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>
      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>
      <div class="product-price">
        $${formatCurrency(product.priceCents)}
      </div>
      <div class="product-quantity-container">
        
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>
      <div class="product-spacer"></div>
      <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>
      <button class="add-to-cart-button button-primary js-add-to-cart"
      data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
});
    
document.querySelector('.js-products-grid').innerHTML = productsHTML;
const addedMessageTimeouts = {};
function updateCartQuantity() {
 
  const cartQuantity = calculateCartQuantity();

  document.querySelector('.js-cart-quantity')
    .innerHTML = cartQuantity;
}
updateCartQuantity();


document.querySelectorAll('.js-add-to-cart')
  .forEach((button) => {
  
  button.addEventListener('click', () => {
  const { productId } = button.dataset;

  // Read quantity from the page
  const quantitySelector = document.querySelector(
    `.js-quantity-selector-${productId}`
  );
  const quantity = Number(quantitySelector.value);

  // Update the cart
  addToCart(productId, quantity);

  // Update the cart icon
 updateCartQuantity();

  // Show "Added" message
  // Timeout logic
  
      const addedMessage = document.querySelector(
        `.js-added-to-cart-${productId}`
      );

      addedMessage.classList.add('added-to-cart-visible');

    
      // Check if there's a previous timeout for this
      // product. If there is, we should stop it.
      const previousTimeoutId = addedMessageTimeouts[productId];
      if (previousTimeoutId) {
        clearTimeout(previousTimeoutId);
      }

      const timeoutId = setTimeout(() => {
        addedMessage.classList.remove('added-to-cart-visible');
      }, 2000);

      // Save the timeoutId for this product
      // so we can stop it later if we need to.
      addedMessageTimeouts[productId] = timeoutId;
    });
});
 document.querySelector('.js-search-button')
    .addEventListener('click', () => {
      const search = document.querySelector('.js-search-bar').value;
      window.location.href = `amazon.html?search=${search}`;
    });
  }catch (error) {
  console.error('Failed to load products:', error);

  document.querySelector('.js-products-grid').innerHTML = `
    <p class="error-message">
      Sorry, we couldn't load the products. Please refresh the page.
    </p>
  `;
}
}
  renderProductsGrid()
