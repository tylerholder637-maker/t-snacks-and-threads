import React, { useState } from "react";

const CATEGORIES = ["All", "Snacks", "Drinks", "Apparel"];

export default function Storefront({ products, onAdd }) {
  const [category, setCategory] = useState("All");

  const shown =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div className="storefront">
      <div className="filters">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={c === category ? "chip active" : "chip"}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="muted">No items in this category yet.</p>
      ) : (
        <div className="grid">
          {shown.map((p) => (
            <div className="card" key={p.id}>
              <div className="thumb">
                {p.image ? (
                  <img src={p.image} alt={p.name} />
                ) : (
                  <div className="thumb-placeholder">{p.category}</div>
                )}
              </div>
              <div className="card-body">
                <h3>{p.name}</h3>
                <p className="muted">{p.description}</p>
                <div className="card-footer">
                  <span className="price">£{p.price.toFixed(2)}</span>
                  <button onClick={() => onAdd(p, 1)}>Add to cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
