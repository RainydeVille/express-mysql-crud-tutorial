//fetch and render products
async function loadProducts() {
  const res = await fetch("http://localhost:3000/products");
  const products = await res.json();
  const container = document.getElementById("product-list");

  container.innerHTML = "";

  //add HTML
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "p-2 mb-3 bg-body-secondary rounded";

    card.innerHTML = `
        <p><b>Name: </b>${product.title}</p>
        <p><b>Description: </b>${product.description}</p>
        <p><b>Price: </b>${Number(product.price).toFixed(2)}€</p>
        <button class="btn btn-danger" onclick="deleteProduct(${product.id})" >Delete</button>
        <button class="btn btn-primary" onclick='openUpdateModal(${JSON.stringify(product)})' >Update</button>
        `;

    container.appendChild(card);
  });
}

loadProducts();
