import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { sampleProducts } from "./data/sampleProducts";
import Storefront from "./components/Storefront.jsx";
import Cart from "./components/Cart.jsx";
import Checkout from "./components/Checkout.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";

const PRODUCTS_KEY = "campus-shop:products";
const CART_KEY = "campus-shop:cart";

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [view, setView] = useState("shop"); // shop | cart | checkout | admin
  const [products, setProducts] = useState(() =>
    loadJSON(PRODUCTS_KEY, sampleProducts)
  );
  const [cart, setCart] = useState(() => loadJSON(CART_KEY, []));
  const [session, setSession] = useState(null); // Supabase session once fully logged in
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // Keep admin session in sync with Supabase (handles refresh/logout elsewhere)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  function addToCart(product, qty = 1) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...product, qty }];
    });
  }

  function updateQty(id, qty) {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  function placeOrder(details) {
    setOrderConfirmed({ ...details, items: cart, placedAt: new Date() });
    setCart([]);
    setView("confirmation");
  }

  async function logoutAdmin() {
    await supabase.auth.signOut();
    setSession(null);
    setView("shop");
  }

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">T Snacks and Threads</div>
        <nav>
          <button
            className={view === "shop" ? "active" : ""}
            onClick={() => setView("shop")}
          >
            Shop
          </button>
          <button
            className={view === "cart" ? "active" : ""}
            onClick={() => setView("cart")}
          >
            Cart {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
          <button
            className={view === "admin" ? "active" : ""}
            onClick={() => setView("admin")}
          >
            Admin
          </button>
        </nav>
      </header>

      <main>
        {view === "shop" && (
          <Storefront products={products} onAdd={addToCart} />
        )}

        {view === "cart" && (
          <Cart
            cart={cart}
            onUpdateQty={updateQty}
            onRemove={removeFromCart}
            onCheckout={() => setView("checkout")}
            onContinueShopping={() => setView("shop")}
          />
        )}

        {view === "checkout" && (
          <Checkout
            cart={cart}
            onPlaceOrder={placeOrder}
            onBack={() => setView("cart")}
          />
        )}

        {view === "confirmation" && orderConfirmed && (
          <div className="panel confirmation">
            <h2>Order placed</h2>
            <p>
              Thanks, {orderConfirmed.name}. Your order total was £
              {orderConfirmed.total.toFixed(2)}.
            </p>
            <p className="muted">
              This is a simulated checkout — no real payment was taken. Wire
              up a real processor (e.g. Stripe) before taking live orders.
            </p>
            <button onClick={() => setView("shop")}>Back to shop</button>
          </div>
        )}

        {view === "admin" && !session && <AdminLogin />}

        {view === "admin" && session && (
          <AdminDashboard
            products={products}
            setProducts={setProducts}
            onLogout={logoutAdmin}
          />
        )}
      </main>
    </div>
  );
}
