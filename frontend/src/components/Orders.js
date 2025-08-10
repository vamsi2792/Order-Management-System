import React, { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:8000/orders/");
    const data = await res.json();
    setOrders(data);
  };

  const fetchCustomers = async () => {
    const res = await fetch("http://localhost:8000/customers/");
    const data = await res.json();
    setCustomers(data);
  };

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

  const startEdit = (order) => {
    setEditId(order.id);
    setSelectedCustomer(order.customer.id);
    setSelectedProductIds(order.products.map((p) => p.id));
  };

  const cancelEdit = () => {
    resetForm();
    setEditId(null);
  };

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

  const deleteOrder = async (id) => {
    await fetch(`http://localhost:8000/orders/${id}`, {
      method: "DELETE",
    });
    fetchOrders();
  };

  const resetForm = () => {
    setSelectedCustomer("");
    setSelectedProductIds([]);
  };

  const toggleProduct = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-indigo-700">Orders</h2>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Products</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {products.map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-2 border p-2 rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedProductIds.includes(p.id)}
                  onChange={() => toggleProduct(p.id)}
                  className="w-4 h-4"
                />
                <span>{p.name} (${p.price})</span>
              </label>
            ))}
          </div>
        </div>

        {editId ? (
          <div className="flex gap-3">
            <button
              onClick={updateOrder}
              className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Update Order
            </button>
            <button
              onClick={cancelEdit}
              className="px-5 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={addOrder}
            className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Add Order
          </button>
        )}
      </div>

      <hr className="my-6" />

      <ul className="space-y-4">
        {orders.map((order) => (
          <li
            key={order.id}
            className="p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold text-lg">
                  Order #{order.id} — {order.customer?.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-500">
                  {order.customer?.email || "Unknown"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(order)}
                  className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteOrder(order.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>

            <ul className="ml-4 list-disc text-gray-700">
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
