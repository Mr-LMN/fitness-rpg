import React, { useState } from "react";
import {
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import "./styles/LoginForm.css";
import logo from "/Pencoedtre_Logo.png";

// Simple staff gate — in production use Firebase custom claims or a proper role system
const SLT_PASSCODE = "PHS_SLT_2026";

export default function LoginForm({ onLogin, onSLTAccess }) {
  const [tab, setTab] = useState("login"); // "login" | "register" | "slt"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sltCode, setSltCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStudentAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let cred;
      if (tab === "register") {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
          setError("An account already exists. Please use Student Login.");
          setLoading(false);
          return;
        }
        cred = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        cred = await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin(cred.user);
    } catch (err) {
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found. Try 'New Student' to register.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error — check your connection.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSLTAccess = (e) => {
    e.preventDefault();
    if (sltCode.trim() === SLT_PASSCODE) {
      onSLTAccess?.();
    } else {
      setError("Incorrect passcode. Ask your IT coordinator.");
    }
  };

  const switchTab = (newTab) => {
    setTab(newTab);
    setError("");
    setEmail("");
    setPassword("");
    setSltCode("");
  };

  return (
    <div className="login-screen">
      <img src={logo} alt="Pencoedtre High School" className="login-logo" />

      <div className="login-card">
        <h2 className="login-heading">Fitness RPG</h2>
        <p className="login-tagline">Pencoedtre High School</p>

        {/* Tabs */}
        <div className="login-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === "login"}
            className={`login-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => switchTab("login")}
          >
            Student Login
          </button>
          <button
            role="tab"
            aria-selected={tab === "register"}
            className={`login-tab ${tab === "register" ? "active" : ""}`}
            onClick={() => switchTab("register")}
          >
            New Student
          </button>
          <button
            role="tab"
            aria-selected={tab === "slt"}
            className={`login-tab login-tab-slt ${tab === "slt" ? "active" : ""}`}
            onClick={() => switchTab("slt")}
          >
            SLT / Staff
          </button>
        </div>

        {/* Student login */}
        {tab === "login" && (
          <form onSubmit={handleStudentAuth} className="login-form-inner" noValidate>
            <label className="login-label" htmlFor="li-email">School Email</label>
            <input
              id="li-email"
              type="email"
              className="login-input"
              placeholder="name@pencoedtre.co.uk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <label className="login-label" htmlFor="li-pass">Password</label>
            <input
              id="li-pass"
              type="password"
              className="login-input"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {error && <p className="login-error" role="alert">{error}</p>}
            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
        )}

        {/* New student register */}
        {tab === "register" && (
          <form onSubmit={handleStudentAuth} className="login-form-inner" noValidate>
            <p className="login-note">
              👋 Welcome! Create your account with your school email address.
            </p>
            <label className="login-label" htmlFor="reg-email">School Email</label>
            <input
              id="reg-email"
              type="email"
              className="login-input"
              placeholder="name@pencoedtre.co.uk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <label className="login-label" htmlFor="reg-pass">Choose a Password</label>
            <input
              id="reg-pass"
              type="password"
              className="login-input"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
            />
            {error && <p className="login-error" role="alert">{error}</p>}
            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}

        {/* SLT staff access */}
        {tab === "slt" && (
          <form onSubmit={handleSLTAccess} className="login-form-inner" noValidate>
            <p className="slt-note">
              📊 Senior Leadership and PE staff access only.
              Enter the staff passcode to view the school dashboard and class data.
            </p>
            <label className="login-label" htmlFor="slt-pass">Staff Passcode</label>
            <input
              id="slt-pass"
              type="password"
              className="login-input"
              placeholder="Enter staff passcode"
              value={sltCode}
              onChange={(e) => setSltCode(e.target.value)}
              autoComplete="off"
            />
            {error && <p className="login-error" role="alert">{error}</p>}
            <button type="submit" className="login-submit login-submit-slt">
              Access SLT Dashboard
            </button>
          </form>
        )}

        <p className="login-footer">
          Having trouble? Ask your PE teacher for help.
        </p>
      </div>
    </div>
  );
}
