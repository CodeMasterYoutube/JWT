import React, { useState } from "react";
import { useAuth } from "../contexts/authContext";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const { setToken } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    const endpoint = isSignup ? "/api/signup" : "/api/signin";
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      console.log("Data: ", data);
      console.log("response: ", response);
      if (response.ok) {
        if (!isSignup) {
          setToken(data.token);
        } else {
          setIsSignup(false);
        }
      } else {
        setPassword("");
        setUsername("");
        alert(data.message);
      }
    } catch (error) {
      alert(" An error ocurred when submitting the form");
    }
  }
  return (
    <div className="auth-container">
      <h2> {isSignup ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit"> {isSignup ? "Sign Up" : "Sign In"}</button>
      </form>
      <button onClick={() => setIsSignup(!isSignup)}>
        {isSignup
          ? "Already have an account? Sign in"
          : "Need an account? Sign up"}
      </button>
    </div>
  );
}
