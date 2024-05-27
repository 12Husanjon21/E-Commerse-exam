document.addEventListener("DOMContentLoaded", () => {
  init();

  async function init() {
    const productId = getId();
    const product = await fetchProduct(productId);
    console.log(product);

    if (product) {
      renderProduct(product);
    } else {
      console.error("Product not found");
    }
  }

  function getId() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");

    return id;
  }

  async function fetchProduct(id) {
    showSpinner();

    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return result;
    } catch (error) {
      console.error("Failed to fetch product:", error);
      return null;
    } finally {
      hideSpinner;
    }
  }

  function renderProduct(product) {
    const productTitle = document.querySelector(".productName > b");
    const productImg = document.querySelector(".imgSide > img");
    const productName = document.querySelector(".title > h2");
    const stars = document.querySelector(".stars");
    const reviews = document.querySelector(".reviews");
    const price = document.querySelector(".price > b");
    const description = document.querySelector(".description > p");

    productTitle.innerHTML = product.category;
    productImg.src = product.image;
    productName.innerHTML = product.title;
    stars.innerHTML = showStars(Math.round(product.rating.rate));
    reviews.innerHTML = `(${product.rating.count} Reviews)`;
    price.innerHTML = `$${product.price}`;
    description.innerHTML = product.description;
  }

  function showStars(rate) {
    const starsTotal = 5;
    const roundedRate = Math.round(rate);

    let stars = "";
    for (let i = 1; i <= starsTotal; i++) {
      if (i <= roundedRate) {
        stars += "⭐";
      } else {
        stars += "☆";
      }
    }

    return stars;
  }

  function showSpinner() {
    const div = document.createElement("div");
    div.className = "spinner";
    // document.body.prepend(div);
  }

  function hideSpinner() {
    const spinner = document.querySelector(".spinner");
    if (spinner) {
      spinner.remove();
    }
  }
});



















