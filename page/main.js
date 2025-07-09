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

//UPDATE products functionality
function openUpdateModal(product) {
  document.getElementById("update-id").value = product.id;
  document.getElementById("update-title").value = product.title;
  document.getElementById("update-price").value = product.price;
  document.getElementById("update-description").value = product.description;

  const modal = new bootstrap.Modal(document.getElementById("updateModal"));
  modal.show();
}

document.getElementById("update-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("update-id").value;

  const updatedProduct = {
    title: document.getElementById("update-title").value,
    price: parseFloat(document.getElementById("update-price").value),
    description: document.getElementById("update-description").value,
  };

  const res = await fetch(`http://localhost:3000/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedProduct),
  });

  if (res.ok) {
    alert("💃 Product updated!");
    bootstrap.Modal.getInstance(document.getElementById("updateModal")).hide();
    loadProducts();
  } else {
    const err = await res.json();
    alert(`😭 Error: ${err.message}`);
  }
});

//DELETE products
async function deleteProduct(id) {
  if (!confirm("🤔 Are you absolutely sure you want to delete this product")) return;

  const res = await fetch(`http://localhost:3000/products/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    alert("🗑️ Product deleted");
    loadProducts();
  } else {
    const err = await res.join();
    alert(`😭 Error: ${err.message}`);
  }
}
