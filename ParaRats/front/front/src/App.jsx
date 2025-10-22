import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import Dash from "./pages/Dash";
import LoginGrupo from "./pages/LoginGrupo";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Users />} />
        <Route path="/dash" element={<Dash />} />
        <Route path="/grupo" element={<LoginGrupo/>} />
      </Routes>
    </>
  );
}

export default App;
