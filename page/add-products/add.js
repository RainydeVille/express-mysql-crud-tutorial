//ADD products
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("product-name").value.trim();
  const description = document.getElementById("product-description").value.trim();
  const price = parseFloat(document.getElementById("product-price").value);

  if (!title || !description || isNaN(price) || price <= 0) {
    return alert("🤨 Please fill all fields correctly");
  }

  const newProduct = { title, description, price };

  const res = await fetch("http://localhost:3000/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct),
  });

  if (res.ok) {
    alert("💃 Product added successfully!");
    window.location.href = "/page"; //Redirect back to product list
  } else {
    const err = await res.json();
    alert(`😭 Error: ${err.message}`);
  }
});
