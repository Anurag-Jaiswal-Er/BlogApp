import React from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Components/Home.jsx";
import Blogs from "./Pages/Blogs.jsx";
import Creators from "./Pages/Creators.jsx";
import Contact from "./Pages/Contact.jsx";
import About from "./Pages/About.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";

import { Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./Context/AuthProvider.jsx";
function App() {
  const location = useLocation();
  // navebar aur footer kaha kaha dikhana h iske liye
  const hideNavbarFooter = ["/login", "/dashboard", "/register"].includes(
    location.pathname
  );
  const { blogs } = useAuth();
  console.log(blogs);
  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      {/* Define route */}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/blogs" element={<Blogs />} />
        <Route exact path="/Contact" element={<Contact />} />
        <Route exact path="/About" element={<About />} />
        <Route exact path="/Creators" element={<Creators />} />
        <Route exact path="/Dashboard" element={<Dashboard />} />
        <Route exact path="/Register" element={<Register />} />
        <Route exact path="/Login" element={<Login />} />
      </Routes>
      {!hideNavbarFooter && <Footer />}
    </>
  );
}

export default App;
