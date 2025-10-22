import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Dumbbell } from "lucide-react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-weight: bold;
  margin-top: 8px;
  transition: background 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { email, senha });

      // ✅ Salva token e email no localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.email);

      // ✅ Redireciona para a tela de Dash
      navigate("/grupo");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Erro ao fazer login!");
    }
  };

  return (
    <Container>
      <Card>
        <Dumbbell size={40} color="#007bff" />
        <h2>Login Pararats</h2>
        <form onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <Button type="submit">Entrar</Button>
        </form>
      </Card>
    </Container>
  );
}

export default Login;
