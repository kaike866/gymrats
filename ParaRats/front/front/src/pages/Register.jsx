import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Flame } from "lucide-react";

const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Card = styled.div`
  position: relative;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #ffcc00;
  box-shadow: 0 0 20px rgba(255, 204, 0, 0.15);
  border-radius: 16px;
  padding: 40px 35px;
  text-align: center;
  color: white;
  width: 340px;
  z-index: 2;
  font-family: "Poppins", sans-serif;
`;

const Title = styled.h2`
  color: #ffcc00;
  margin-bottom: 8px;
  font-size: 1.6rem;
  letter-spacing: 1px;
`;

const Subtitle = styled.p`
  font-size: 0.85rem;
  color: #bbb;
  margin-bottom: 24px;
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 14px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #555;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  transition: 0.3s;

  &:focus {
    border-color: #ffcc00;
    box-shadow: 0 0 8px rgba(255, 204, 0, 0.4);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  width: 100%;
  background: linear-gradient(90deg, #ffcc00, #ffdd33);
  border: none;
  color: #000;
  font-weight: 700;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(255, 204, 0, 0.3);
  }
`;

const RegisterLink = styled.p`
  margin-top: 12px;
  font-size: 0.85rem;
  color: #ccc;

  a {
    color: #ffcc00;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // 🔹 Função para desenhar partículas e conexões (igual login)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffcc00";
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = "rgba(255, 204, 0, 0.4)";
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }, []);

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
      <Canvas ref={canvasRef} />
      <Card>
        <Flame size={42} color="#ffcc00" />
        <Title>DATAWAKE</Title>
        <Subtitle>Crie sua conta para acessar o DataDriven</Subtitle>

        <form onSubmit={handleRegister}>
          <Input
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
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
          <Button type="submit">Registrar</Button>
        </form>

        <RegisterLink>
          Já tem uma conta? <a onClick={() => navigate("/login")}>Fazer login</a>
        </RegisterLink>
      </Card>
    </Container>
  );
}

export default Register;
