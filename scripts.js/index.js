document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");

  // IIFE
  (async function () {
    const hasToken = checkToken();

    if (!hasToken) {
      redirectToLogin();
    }

    const products = await fetchProducts(); // array

    if (products && products.length) {
      renderProducts(products);
    }
  })();

  function checkToken() {
    const token = localStorage.getItem("token");
    return Boolean(token);
  }

  function redirectToLogin() {
    window.location.href = "./login.html";
  }

  async function fetchProducts() {
    showSpinner();

    try {
      const response = await fetch("https://fakestoreapi.com/products");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const products = await response.json();

      return products;
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      hideSpinner();
    }
  }

  function showSpinner() {
    const div = document.createElement("div");
    div.className = "spinner";
    document.body.prepend(div);
  }

  function hideSpinner() {
    const spinner = document.querySelector(".spinner");
    if (spinner) {
      spinner.remove();
    }
  }

  function updateClock() {
    const now = new Date();

    const hourDiv = document.getElementById("hour");
    const dayDiv = document.getElementById("day");
    const minuteDiv = document.getElementById("minutes");
    const secondDiv = document.getElementById("second");

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    hourDiv.innerHTML = `<span>${hours}</span> Hours`;
    dayDiv.innerHTML = `<span>${now.getDate()}</span> Days`;
    minuteDiv.innerHTML = `<span>${minutes}</span> Minutes`;
    secondDiv.innerHTML = `<span>${seconds}</span> Seconds`;
  }

  setInterval(updateClock, 1000);

  function renderProducts(products) {
    const container = document.createElement("ul");
    container.className = "container center";

    const section3 = document.querySelector(".section3");

    products.forEach(function (product) {
      const li = document.createElement("li");
      li.id = `productId-${product.id}`;

      const a = document.createElement("a");
      a.href = `http://127.0.0.1:5501/product.html?id=${product.id}`;

      const img = document.createElement("img");
      img.src = product.image;
      img.addEventListener('click', function () {
        window.location.href = `./product.html?id=${product.id}`;
      });
      li.append(img);

      const title = document.createElement("p");
      title.textContent = product.title;
      a.append(title);
      li.append(a);

      const price = document.createElement("strong");
      price.textContent = `$${product.price}`;
      price.style.marginTop = "2rem";
      price.style.color = "red";
      li.append(price);

      const starsContainer = document.createElement("div");
      const stars = "<span>⭐️</span>".repeat(Math.round(product.rating.rate));
      starsContainer.insertAdjacentHTML("beforeend", stars);
      li.append(starsContainer);

      const ratingCount = document.createElement("div");
      ratingCount.textContent = `(${product.rating.count})`;
      li.append(ratingCount);

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "remover";
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = function () {
        deleteProduct(product.id);
      };
      li.append(deleteBtn);

      container.append(li);
    });

    section3.before(container);
  }

  async function deleteProduct(id) {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status}`);
      }

      const product = document.getElementById(`productId-${id}`);
      if (product) {
        product.remove();
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  }
});
