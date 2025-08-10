import React, { useEffect, useState } from "react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchCustomers = async () => {
    const res = await fetch("http://localhost:8000/customers/");
    const data = await res.json();
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const addCustomer = async () => {
    if (!name || !email) return alert("Please enter both name and email");
    await fetch("http://localhost:8000/customers/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    setName("");
    setEmail("");
    fetchCustomers();
  };

  const startEdit = (customer) => {
    setEditId(customer.id);
    setName(customer.name);
    setEmail(customer.email);
  };

  const cancelEdit = () => {
    setEditId(null);
    setName("");
    setEmail("");
  };

  const updateCustomer = async () => {
    if (!name || !email) return alert("Please enter both name and email");
    await fetch(`http://localhost:8000/customers/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    setEditId(null);
    setName("");
    setEmail("");
    fetchCustomers();
  };

  const deleteCustomer = async (id) => {
    await fetch(`http://localhost:8000/customers/${id}`, {
      method: "DELETE",
    });
    fetchCustomers();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-indigo-700">Customers</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {editId ? (
          <>
            <button
              onClick={updateCustomer}
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
            onClick={addCustomer}
            className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Add Customer
          </button>
        )}
      </div>

      <ul className="divide-y divide-gray-200">
        {customers.map((c) => (
          <li
            key={c.id}
            className="flex justify-between items-center py-3 hover:bg-gray-50 rounded-md transition"
          >
            <div>
              <p className="text-lg font-medium text-gray-900">{c.name}</p>
              <p className="text-sm text-gray-500">{c.email}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => startEdit(c)}
                className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded hover:bg-yellow-500 transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCustomer(c.id)}
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
