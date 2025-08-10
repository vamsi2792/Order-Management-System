import React, { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null); // Track product being edited

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:8000/products/");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async () => {
    const productPrice = Number(price);
    if (!name || !productPrice || productPrice <= 0) {
      alert("Please enter a valid name and price.");
      return;
    }

    await fetch("http://localhost:8000/products/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: productPrice }),
    });

    setName("");
    setPrice("");
    fetchProducts();
  };

  // Start editing a product
  const startEdit = (product) => {
    setEditId(product.id);
    setName(product.name);
    setPrice(product.price);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditId(null);
    setName("");
    setPrice("");
  };

  // Update product details
  const updateProduct = async () => {
    const productPrice = Number(price);
    if (!name || !productPrice || productPrice <= 0) {
      alert("Please enter a valid name and price.");
      return;
    }

    await fetch(`http://localhost:8000/products/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: productPrice }),
    });

    setEditId(null);
    setName("");
    setPrice("");
    fetchProducts();
  };

  // Delete product
  const deleteProduct = async (id) => {
    await fetch(`http://localhost:8000/products/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  };

  return (
    <div>
      <h2>Products</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Price"
        value={price}
        type="number"
        onChange={(e) => setPrice(e.target.value)}
      />

      {editId ? (
        <>
          <button onClick={updateProduct}>Update Product</button>
          <button onClick={cancelEdit}>Cancel</button>
        </>
      ) : (
        <button onClick={addProduct}>Add Product</button>
      )}

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - ${p.price}{" "}
            <button onClick={() => startEdit(p)}>Edit</button>{" "}
            <button onClick={() => deleteProduct(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
