import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      onLogin(result.user);
    } catch (err) {
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        onLogin(result.user);
      } catch (error) {
        alert("Login failed: " + error.message);
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
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
      <button type="submit">Log In</button>
    </form>
  );
}
