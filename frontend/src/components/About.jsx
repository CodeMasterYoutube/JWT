// components/About.js
import React from "react";
import { useAuth } from "../contexts/authContext";
// import { useNavigate } from "react-router-dom";

function About() {
  const { user, setToken } = useAuth();

  return (
    <div>
      <button className="logout-button " onClick={() => setToken(null)}>
        {" "}
        Log out
      </button>
      <div className="about-content">
        <h1 style={{ fontSize: "40px" }}> Hello {user}</h1>
        <h1>Welcome to the Protected About Page!</h1>
        <p>This page is only visible to authenticated users.</p>
      </div>
    </div>
  );
}

export default About;
