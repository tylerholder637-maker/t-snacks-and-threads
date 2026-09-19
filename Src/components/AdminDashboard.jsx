import React from "react";
import InventoryManager from "./InventoryManager.jsx";

export default function AdminDashboard({ products, setProducts, onLogout }) {
  return (
    <div className="panel">
      <div className="admin-header">
        <h2>Admin dashboard</h2>
        <button className="secondary" onClick={onLogout}>
          Log out
        </button>
      </div>
      <InventoryManager products={products} setProducts={setProducts} />
    </div>
  );
}
