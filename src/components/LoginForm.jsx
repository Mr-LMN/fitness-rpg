import React, { useState } from "react";
import {
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import "./styles/LoginForm.css";
import logo from "/Pencoedtre_Logo.png";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      let cred;
      if (isNewUser) {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
          setErrorMessage("Account already exists. Please log in.");
          setLoading(false);
          return;
        }
        cred = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        cred = await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin(cred.user);
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setErrorMessage("Incorrect password.");
      } else if (error.code === "auth/network-request-failed") {
        setErrorMessage("Network error. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        setErrorMessage("Account not found.");
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <img src={logo} alt="Pencoedtre High" className="login-logo" />
      <form onSubmit={handleLogin} className="login-form">
        <h2>Student Login</h2>
      <div className="mode-toggle">
        <button
          type="button"
          className={!isNewUser ? "active" : ""}
          onClick={() => setIsNewUser(false)}
        >
          Current User
        </button>
        <button
          type="button"
          className={isNewUser ? "active" : ""}
          onClick={() => setIsNewUser(true)}
        >
          New User
        </button>
      </div>
      <input
        type="email"
        placeholder="Your school email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Choose a password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : isNewUser ? "Create Account" : "Log In"}
      </button>
      {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
    </div>
  );
}
