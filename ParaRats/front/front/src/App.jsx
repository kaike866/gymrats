import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AssinaturaDigital from "./pages/AssinaturaDigital";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Register />} />
        <Route path="/assinatura" element={<AssinaturaDigital />} />
      </Routes>
    </>
  );
}

export default App;
