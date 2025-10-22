// src/pages/Dash.jsx
import React, { useEffect } from "react";
import styled from "styled-components";
import { Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  text-align: center;
  padding: 40px;
`;

const Button = styled.button`
  background-color: #ff4747;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  font-weight: bold;
`;

export default function Dash() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🚨 Se não tiver token, volta pro login
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <Container>
      <Dumbbell size={50} color="#007bff" />
      <h1>🏋️‍♂️ Bem-vindo à Pararats Gym!</h1>
      <p>Você está logado como: {localStorage.getItem("email")}</p>
      <Button onClick={handleLogout}>Sair</Button>
    </Container>
  );
}
