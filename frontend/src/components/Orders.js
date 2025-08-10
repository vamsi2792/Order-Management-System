import React, { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [editId, setEditId] = useState(null); // Track order being edited

  // Fetch orders
  const fetchOrders = async () => {
    const res = await fetch("http://localhost:8000/orders/");
    const data = await res.json();
    setOrders(data);
  };

  // Fetch customers for dropdown
  const fetchCustomers = async () => {
    const res = await fetch("http://localhost:8000/customers/");
    const data = await res.json();
    setCustomers(data);
  };

  // Fetch products for multi-select
  const fetchProducts = async () => {
    const res = await fetch("http://localhost:8000/products/");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchProducts();
  }, []);

  // Add new order
  const addOrder = async () => {
    if (!selectedCustomer || selectedProductIds.length === 0) {
      alert("Select a customer and at least one product.");
      return;
    }

    await fetch("http://localhost:8000/orders/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id: Number(selectedCustomer),
        product_ids: selectedProductIds.map(Number),
      }),
    });

    resetForm();
    fetchOrders();
  };

  // Start editing an order
  const startEdit = (order) => {
    setEditId(order.id);
    setSelectedCustomer(order.customer.id);
    setSelectedProductIds(order.products.map((p) => p.id));
  };

  // Cancel editing
  const cancelEdit = () => {
    resetForm();
    setEditId(null);
  };

  // Update order
  const updateOrder = async () => {
    if (!selectedCustomer || selectedProductIds.length === 0) {
      alert("Select a customer and at least one product.");
      return;
    }

    await fetch(`http://localhost:8000/orders/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id: Number(selectedCustomer),
        product_ids: selectedProductIds.map(Number),
      }),
    });

    resetForm();
    setEditId(null);
    fetchOrders();
  };

  // Delete order
  const deleteOrder = async (id) => {
    await fetch(`http://localhost:8000/orders/${id}`, {
      method: "DELETE",
    });
    fetchOrders();
  };

  // Reset form inputs
  const resetForm = () => {
    setSelectedCustomer("");
    setSelectedProductIds([]);
  };

  // Toggle product selection
  const toggleProduct = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <h2>Orders</h2>

      <div>
        <label>Customer: </label>
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Products:</label>
        {products.map((p) => (
          <div key={p.id}>
            <input
              type="checkbox"
              checked={selectedProductIds.includes(p.id)}
              onChange={() => toggleProduct(p.id)}
            />
            {p.name} (${p.price})
          </div>
        ))}
      </div>

      {editId ? (
        <>
          <button onClick={updateOrder}>Update Order</button>
          <button onClick={cancelEdit}>Cancel</button>
        </>
      ) : (
        <button onClick={addOrder}>Add Order</button>
      )}

      <hr />

      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <b>Order #{order.id}</b> by {order.customer ? order.customer.name : "Unknown"} (
{order.customer ? order.customer.email : "Unknown"})

            <button onClick={() => startEdit(order)}>Edit</button>{" "}
            <button onClick={() => deleteOrder(order.id)}>Delete</button>
            <ul>
              {order.products.map((p) => (
                <li key={p.id}>
                  {p.name} - ${p.price}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
