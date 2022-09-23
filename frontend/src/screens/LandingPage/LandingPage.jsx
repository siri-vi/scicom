import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div>
      <Link to="/profile">Profile</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  );
}

export default LandingPage;
