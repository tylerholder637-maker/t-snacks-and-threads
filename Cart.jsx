import React from "react";

export default function Cart({
  cart,
  onUpdateQty,
  onRemove,
  onCheckout,
  onContinueShopping,
}) {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="panel">
        <h2>Your cart is empty</h2>
        <button onClick={onContinueShopping}>Browse the shop</button>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Your cart</h2>
      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item.id} className="cart-row">
            <div>
              <strong>{item.name}</strong>
              <div className="muted">£{item.price.toFixed(2)} each</div>
            </div>
            <div className="qty-control">
              <button onClick={() => onUpdateQty(item.id, item.qty - 1)}>
                −
              </button>
              <span>{item.qty}</span>
              <button onClick={() => onUpdateQty(item.id, item.qty + 1)}>
                +
              </button>
            </div>
            <div className="line-total">
              £{(item.price * item.qty).toFixed(2)}
            </div>
            <button className="text-btn" onClick={() => onRemove(item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <span>Total</span>
        <strong>£{total.toFixed(2)}</strong>
      </div>
      <div className="row-gap">
        <button className="secondary" onClick={onContinueShopping}>
          Keep shopping
        </button>
        <button onClick={onCheckout}>Checkout</button>
      </div>
    </div>
  );
}
