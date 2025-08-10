import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Customers from "./components/Customers";
import Products from "./components/Products";
import Orders from "./components/Orders";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <header className="bg-indigo-600 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-wide">Order Management System</h1>
            <nav className="space-x-6">
              {["/", "/products", "/orders"].map((path, i) => {
                const name = path === "/" ? "Customers" : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2);
                return (
                  <NavLink
                    key={path}
                    to={path}
                    end={path === "/"}
                    className={({ isActive }) =>
                      isActive
                        ? "text-yellow-300 font-semibold border-b-2 border-yellow-300"
                        : "hover:text-yellow-300 transition"
                    }
                  >
                    {name}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-10">
          <Routes>
            <Route path="/" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>

        <footer className="text-center text-gray-400 text-sm py-6">
          &copy; 2025 Your Name. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}
