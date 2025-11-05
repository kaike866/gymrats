import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { Lock } from "lucide-react";
import VantaBackground from "../components/VantaBackground"; // fundo com partículas amarelas

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-family: "Poppins", sans-serif;
  color: #fff;
  background: transparent; /* deixa ver o efeito Vanta */
`;

/* Card central */
const Card = styled.div`
  width: 380px;
  padding: 40px 30px;
  border-radius: 14px;
  background: rgba(10, 10, 10, 0.88);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 204, 0, 0.08);
  text-align: center;
  z-index: 2;
  backdrop-filter: blur(8px);
`;

/* Logo e título */
const LogoRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px;

  img {
    height: 48px;
    margin-bottom: 10px;
  }

  .brand {
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: #ffcc00;
  }

  p {
    margin: 0;
    color: #ccc;
    font-size: 14px;
  }
`;

/* Inputs e botão */
const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  margin-top: 14px;
  border-radius: 8px;
  background: #111;
  border: 1px solid rgba(255, 204, 0, 0.25);
  color: #eee;
  font-size: 14px;
  transition: 0.2s ease;

  &::placeholder {
    color: #888;
  }

  &:focus {
    outline: none;
    border-color: #ffcc00;
    box-shadow: 0 0 10px rgba(255, 204, 0, 0.15);
    background: #151515;
  }
`;

const Button = styled.button`
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  background: linear-gradient(180deg, #ffcc00, #f5b300);
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(255, 204, 0, 0.25);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const FooterText = styled.p`
  color: #bdbdbd;
  font-size: 13px;
  margin-top: 14px;

  a {
    color: #ffcc00;
    text-decoration: none;
    font-weight: 700;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { email, senha });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.email);
      navigate("/assinatura");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Erro ao fazer login!");
    }
  };

  return (
    <>
      {/* Efeito de partículas amarelas */}
      <VantaBackground color="#ffcc00" backgroundColor="#000000" />
      <Page>
        <Card>
          <LogoRow>
            <div className="brand">DATAWAKE</div>
            <p>Faça login para acessar o DataDriven</p>
          </LogoRow>

          <form onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder="E-mail corporativo"
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
            <Button type="submit">Login</Button>
          </form>

          <FooterText>
            Não tem uma conta? <Link to="/register">Registrar</Link>
          </FooterText>
        </Card>
      </Page>
    </>
  );
}
