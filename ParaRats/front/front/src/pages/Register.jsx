import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Flame } from "lucide-react";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

const Card = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 320px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Button = styled.button`
  background-color: #ffcc00;
  color: #333;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-weight: bold;
  margin-top: 8px;
  transition: background 0.3s;

  &:hover {
    background-color: #ffd633;
  }
`;

function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", { nome, email, senha });
      alert("Usuário registrado com sucesso!");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert("Esse email já está registrado. Tente outro.");
      } else {
        alert("Erro ao registrar usuário. Tente novamente.");
      }
    }
  };


  return (
    <Container>
      <Card>
        <Flame size={40} color="#ffcc00" />
        <h2>Registrar Pararats</h2>
        <form onSubmit={handleRegister}>
          <Input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          <Button type="submit">Cadastrar</Button>
        </form>
      </Card>
    </Container>
  );
}

export default Register;
