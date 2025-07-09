import express from "express";
import cors from "cors";
import connection from "./mysql-connect.js";

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3000, () => {
  console.log("💃 Server is dancing in port 3000");
});

//GET all products
app.get("/products", async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT * FROM products");
    res.status(200).send(rows);
  } catch (error) {
    console.error("😭 Error fetching products", error);
    res.status(500).send({ message: "🤨 Server error while fetching products" });
  }
});

//GET single product by id
app.get("/products/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send({
      message: "🤨 bruh, ID must be a number",
    });
  }

  try {
    const [rows] = await connection.query("SELECT * FROM products WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).send({
        message: "😲 Product not found!",
      });
    }
    res.status(200).send(rows[0]);
  } catch (error) {
    console.error("😭 Database error", error);
    res.status(500).send({ message: "😭 Internal server error" });
  }
});

//ADD products
app.post("/products", async (req, res) => {
  const { title, price, description } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).send({ message: "🤨 Title must be a non-empty string" });
  }
  if (typeof price !== "number" || price <= 0) {
    return res.status(400).send({ message: "🤨 Price must be a positive number" });
  }
  if (!description || typeof description !== "string") {
    return res.status(400).send({ message: "🤨 Description must be a non-empty string" });
  }

  try {
    const [result] = await connection.query("INSERT INTO products (title, price, description) VALUES (?, ?, ?)", [title, price, description]);

    //MySQL gives back insertId
    const newProduct = {
      id: result.insertId,
      title,
      price,
      description,
    };

    res.status(201).send({ message: "💃 Product created successfully!", data: newProduct });
  } catch (error) {
    console.error("😭 Failed to insert product", error);
    res.status(500).send({ message: "😭 Server error while creating product" });
  }
});

//UPDATE products
app.put("/products/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, price, description } = req.body;

  if (isNaN(id)) {
    return res.status(400).send({
      message: "🤨 bruh, ID must be a number",
    });
  }

  if (!title && !price && !description) {
    return res.status(400).send({ message: "🤨 Must provide at least one field to update" });
  }

  try {
    //Does product exist?
    const [exist] = await connection.query("SELECT * FROM products WHERE id = ?", [id]);
    if (exist.length === 0) {
      return res.status(404).send({ message: "😲 Product not found!" });
    }

    //dynamic update
    const fields = [];
    const values = [];

    if (!title !== undefined) {
      fields.push("title = ?");
      values.push(title);
    }
    if (!price !== undefined) {
      fields.push("price = ?");
      values.push(price);
    }
    if (!description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }

    values.push(id); //if everything okay then push ID

    const sql = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`;
    await connection.query(sql, values);

    res.status(200).send({ message: "💃 Product updated successfully" });
  } catch (error) {
    console.error("😭 Failed to update product:", error);
    res.status(500).send({ message: "😭 Internal server error" });
  }
});

//DELETE products
app.delete("/products/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send({
      message: "🤨 bruh, ID must be a number",
    });
  }

try {
  const [result] = await connection.query("DELETE FROM products WHERE id = ?". [id]);

  if (result.affectedRows === 0) {
    return res.status(404).send({message: `😲 Product with ID ${id} not found`});
  }

  res.status(200).send({message: `🗑️ Product with ID ${id} has been successfully deleted`});
} catch(error) {
  console.error("😭 Failed to delete product", error);
  res.status(500).send({message: "😭 Server error during deletion"});
}
});