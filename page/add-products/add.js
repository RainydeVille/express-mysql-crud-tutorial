//TOAST
function showToast(message, isSuccess = true) {
  const toastElement = document.getElementById("toast");
  const toastBody = document.getElementById("toast-body");

  toastBody.textContent = message;

  // Change toast color
  toastElement.classList.remove("text-bg-primary", "text-bg-danger", "text-bg-success");
  toastElement.classList.add(isSuccess ? "text-bg-success" : "text-bg-danger");

  const bsToast = new bootstrap.Toast(toastElement);
  bsToast.show();
}

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

  try {
    const res = await fetch("http://localhost:3000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    const data = await res.json();

    if (res.ok) {
      showToast("🎉 Product added successfully!");
      setTimeout(() => (window.location.href = "/page"), 1500);
    } else {
      showToast(`😭 Error: ${data.message}`, false);
    }
  } catch (error) {
    showToast("🚨 Network error", false);
  }
});
