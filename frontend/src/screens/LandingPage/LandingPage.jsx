import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  // useEffect(() => {
  //   const userInfo = localStorage.getItem("userInfo");

  //   if (userInfo) {
  //     history.push("/profile");
  //   }
  // }, [history]);

  return (
    <div>
      <Link to="/profile">Profile</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  );
}

export default LandingPage;
