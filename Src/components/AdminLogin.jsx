import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminLogin() {
  const [step, setStep] = useState("password"); // password | code
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handlePassword(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    // Step 1: Supabase checks the password against its own server-side
    // records. The password is never stored or checked in this app's code.
    const { error: pwError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (pwError) {
      setError(pwError.message);
      setBusy(false);
      return;
    }
    // Password is correct. Immediately sign back out of that session and
    // require a one-time code before granting real access — this is the
    // second factor.
    await supabase.auth.signOut();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    setBusy(false);
    if (otpError) {
      setError(otpError.message);
      return;
    }
    setStep("code");
  }

  async function handleCode(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    // Step 2: Supabase verifies the 6-digit code it emailed you. Only on
    // success does a real session get created, which App.jsx picks up.
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    setBusy(false);
    if (verifyError) {
      setError(verifyError.message);
      return;
    }
    // Success — App.jsx's onAuthStateChange listener will pick up the
    // session automatically and switch to the dashboard.
  }

  return (
    <div className="panel admin-login">
      <h2>Admin sign in</h2>

      {step === "password" && (
        <form onSubmit={handlePassword} className="form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={busy}>
            {busy ? "Checking…" : "Continue"}
          </button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={handleCode} className="form">
          <p className="muted">
            We emailed a 6-digit code to {email}. Enter it below to finish
            signing in.
          </p>
          <label>
            Code
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              maxLength={6}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={busy}>
            {busy ? "Verifying…" : "Verify and sign in"}
          </button>
        </form>
      )}
    </div>
  );
}
