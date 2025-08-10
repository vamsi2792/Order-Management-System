import React, { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);

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

  const startEdit = (product) => {
    setEditId(product.id);
    setName(product.name);
    setPrice(product.price);
  };

  const cancelEdit = () => {
    setEditId(null);
    setName("");
    setPrice("");
  };

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

  const deleteProduct = async (id) => {
    await fetch(`http://localhost:8000/products/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-indigo-700">Products</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          placeholder="Price"
          value={price}
          type="number"
          onChange={(e) => setPrice(e.target.value)}
          className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {editId ? (
          <>
            <button
              onClick={updateProduct}
              className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Update
            </button>
            <button
              onClick={cancelEdit}
              className="px-5 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={addProduct}
            className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Add Product
          </button>
        )}
      </div>

      <ul className="divide-y divide-gray-200">
        {products.map((p) => (
          <li
            key={p.id}
            className="flex justify-between items-center py-3 hover:bg-gray-50 rounded-md transition"
          >
            <div>
              <p className="text-lg font-medium text-gray-900">{p.name}</p>
              <p className="text-sm text-gray-500">${p.price}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => startEdit(p)}
                className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded hover:bg-yellow-500 transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProduct(p.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
