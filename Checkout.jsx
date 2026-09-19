import React, { useState } from "react";

export default function Checkout({ cart, onPlaceOrder, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    // Simulated processing delay — replace this whole block with a real
    // payment provider (Stripe Checkout / Payment Element is the usual
    // free-to-integrate option) before taking real money.
    setTimeout(() => {
      onPlaceOrder({ name, email, total });
    }, 700);
  }

  return (
    <div className="panel">
      <h2>Checkout</h2>
      <p className="muted callout">
        This form simulates payment for testing. No card details are
        collected or processed — connect a real provider like Stripe before
        launching.
      </p>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <div className="cart-summary">
          <span>Total due</span>
          <strong>£{total.toFixed(2)}</strong>
        </div>
        <div className="row-gap">
          <button type="button" className="secondary" onClick={onBack}>
            Back to cart
          </button>
          <button type="submit" disabled={submitting}>
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </div>
      </form>
    </div>
  );
}
