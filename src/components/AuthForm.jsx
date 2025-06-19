import React, { useState } from "react";
import {
  fetchSignInMethodsForEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

export default function AuthForm({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      const isExistingUser = methods.length > 0;
      let cred;
      if (isExistingUser) {
        cred = await signInWithEmailAndPassword(auth, email, password);
      } else {
        cred = await createUserWithEmailAndPassword(auth, email, password);
      }
      onAuth && onAuth(cred.user);
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
    <form onSubmit={handleSubmit}>
      <h2>Student Login</h2>
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
        {loading ? "Loading..." : "Log In"}
      </button>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </form>
  );
}
