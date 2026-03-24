async function loadProducts() {
  console.log("Fetching data...");

  const res = await fetch("/api/getProducts");
  const products = await res.json();

  console.log(products);

  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image}" width="100%">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <p>Stock: ${p.stock}</p>
      </div>
    `;
  });
}

loadProducts();