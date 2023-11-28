let productsContainer = document.querySelector(".products-con");
let currentPage = 1;
let itemsPerPage = 10;
let cart = [];

function displayProducts(page, data) {
  let startIdx = (page - 1) * itemsPerPage;
  let endIdx = startIdx + itemsPerPage;
  let obj = "";

  for (let i = startIdx; i < endIdx && i < data.products.length; i++) {
    let product = data.products[i];
    obj += `
            <div class="product">
                <img class="w-100" src="${product.images[0]}" alt=""/>
                <div class="des">
                    <span class="brand-name">${product.brand}</span>
                    <h3 onclick="showProductDetails(${product.id})" class="title m-0">${product.title}</h3>
                    <div class="star">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <del class="price">$${product.price}</del>
                            <p class="new-price ms-3 mb-0">$${product.discountPercentage}</p>
                        </div>
                        <div onclick="addToCart(${JSON.stringify(product)})" >
                            <i class="fa-solid fa-shopping-cart"></i>
                        </div>
                    </div>
                </div>
            </div>`;
  }

  productsContainer.innerHTML = obj;
}

function showProductDetails(productId) {
  const productDetailsSection = document.getElementById("productDetails");
  const productDetailsContent = document.getElementById("productDetailsContent");

  // Find the selected product by ID
  const selectedProduct = productsData.products.find(
    (product) => product.id === productId
  );

  // Display product details
  productDetailsContent.innerHTML = `
    <div class="product-img-container d-flex">
      <div class="product-img-list">
        <img class="mb-5 mt-5" src="${selectedProduct.images[0]}" alt=""/>
        <img class="mb-5" src="${selectedProduct.images[1]}" alt=""/>
        <img class="mb-5" src="${selectedProduct.images[2]}" alt=""/>
      </div>
      <div class="main-img">
        <img class="h-100 w-100" src="${selectedProduct.images[0]}" alt=""/>
      </div>
    </div>

    <div class="product-description">
      <span class="brand-name">${selectedProduct.brand}</span>
      <h2 class="product-title">${selectedProduct.title}</h2>
      <p>${selectedProduct.description}</p>
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <del class="price">$${selectedProduct.price}</del>
          <p class="new-price m-0 ms-3">$${selectedProduct.discountPercentage}</p>
        </div>
      </div>
      <span class="stock">Stock: ${selectedProduct.stock}</span>
      <div class="mt-3">
        <button onclick="addToCart(${JSON.stringify(selectedProduct)})" class="btn add-btn">Add to cart</button>
        <button class="btn buyNowBtn">Buy now</button>
      </div>
    </div>
  `;

  let productImgList = document.querySelectorAll(".product-img-list img");
  let mainImg = document.querySelector(".main-img img");

  for (let i = 0; i < productImgList.length; i++) {
    productImgList[i].addEventListener("click", () => {
      mainImg.src = productImgList[i].src;
    });
  }

  // Hide product list and show product details
  document.getElementById("products").style.display = "none";
  productDetailsSection.style.display = "block";
}

function showProductList() {
  document.getElementById("products").style.display = "block";
  document.getElementById("productDetails").style.display = "none";
  document.getElementById("cart").style.display = "none";
}

function addToCart(product) {
  cart.push(product);
  updateCart();
}

function updateCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  cartItemsContainer.innerHTML = '';

  cart.forEach(product => {
    cartItemsContainer.innerHTML += `<li>${product.title} - $${product.price}</li>`;
  });

  // Show the cart section
  document.getElementById("products").style.display = "none";
  document.getElementById("productDetails").style.display = "none";
  document.getElementById("cart").style.display = "block";

  // Update the shopping cart icon with the number of items in the cart
  const cartIcon = document.querySelector(".fa-basket-shopping");
  cartIcon.setAttribute("data-count", cart.length.toString());
}

function updatePagination(currentPage, totalPages) {
  let paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  // Add Previous button
  paginationContainer.innerHTML += `<button  onclick="changePage(${
    currentPage - 1
  })" ${currentPage === 1 ? "disabled" : ""}>Previous</button>`;

  // Add numbered buttons
  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.innerHTML += `<button onclick="changePage(${i})" ${
      i === currentPage ? 'class="active"' : ""
    }>${i}</button>`;
  }

  // Add Next button
  paginationContainer.innerHTML += `<button onclick="changePage(${
    currentPage + 1
  })" ${currentPage === totalPages ? "disabled" : ""}>Next</button>`;
}

function changePage(pageNumber) {
  currentPage = pageNumber;
  displayProducts(currentPage, productsData);
  updatePagination(currentPage, totalPageCount);
}

let productsData; // Declare a variable to store the fetched data
let totalPageCount;

fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((data) => {
    productsData = data;
    totalPageCount = Math.ceil(data.products.length / itemsPerPage);
    displayProducts(currentPage, data);
    updatePagination(currentPage, totalPageCount);
});
