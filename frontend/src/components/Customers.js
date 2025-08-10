import React, { useEffect, useState } from "react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null); // To track which customer is being edited

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

  // Start editing a customer
  const startEdit = (customer) => {
    setEditId(customer.id);
    setName(customer.name);
    setEmail(customer.email);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditId(null);
    setName("");
    setEmail("");
  };

  // Update customer details
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

  // Delete customer
  const deleteCustomer = async (id) => {
    await fetch(`http://localhost:8000/customers/${id}`, {
      method: "DELETE",
    });
    fetchCustomers();
  };

  return (
    <div>
      <h2>Customers</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {editId ? (
        <>
          <button onClick={updateCustomer}>Update Customer</button>
          <button onClick={cancelEdit}>Cancel</button>
        </>
      ) : (
        <button onClick={addCustomer}>Add Customer</button>
      )}

      <ul>
        {customers.map((c) => (
          <li key={c.id}>
            {c.name} - {c.email}{" "}
            <button onClick={() => startEdit(c)}>Edit</button>{" "}
            <button onClick={() => deleteCustomer(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
