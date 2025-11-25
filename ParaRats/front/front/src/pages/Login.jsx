// Login.jsx corrigido
import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import logoParanoa from "../assets/paranoalogosemfundo.png";
import { Eye, EyeOff } from "lucide-react";


const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(180deg, #f7f9fc 0%, #eaf1fb 100%);
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
  background: linear-gradient(90deg, #0b1f3a 0%, #052b6b 100%);
  border: 1px solid #0a64da;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 10px rgba(79, 152, 247, 0.4);
  border-radius: 16px;
  padding: 50px 35px;
  text-align: center;
  color: white;
  width: 380px;
  z-index: 2;
  font-family: "Poppins", sans-serif;
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
  box-sizing: border-box;
  &:focus {
    border-color: #076bee;
    box-shadow: 0 0 8px #4f98f7;
  }
  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  width: 100%;
  background: linear-gradient(90deg, #4f98f7, #0056d6);
  color: #fff;
  border: none;
  font-weight: 700;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 14px #0e2aa5;
    filter: brightness(1.1);
  }
`;

const RegisterLink = styled.p`
  margin-top: 12px;
  font-size: 0.85rem;
  color: #ccc;
  a {
    color: #4f98f7;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const floatLogo = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;

const AnimatedLogo = styled.img`
  width: 42px;
  height: 42px;
  animation: ${floatLogo} 3s ease-in-out infinite;
`;

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
    }));

    let rafId;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0e2aa5";

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = "#4f98f7";
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

      rafId = requestAnimationFrame(draw);
    }

    draw();

    function onResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleSuccessfulLogin = (token, email, nome, isAdmin) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("nome", nome);
    localStorage.setItem("isAdmin", isAdmin ? "1" : "0");
    navigate("/assinatura");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", { email, senha });

      handleSuccessfulLogin(
        res.data.token,
        res.data.email,
        res.data.nome || "Usuário",
        res.data.isAdmin
      );
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao fazer login!");

    }
  };

  return (
    <Container>
      <Canvas ref={canvasRef} />
      <Card>

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <AnimatedLogo src={logoParanoa} alt="Paranoá" />
          <h2 style={{ color: "#fafafa", fontWeight: 600, fontSize: "1.6rem" }}>
            PARANOÁ
          </h2>
        </div>

        <Subtitle>Faça login para acessar o DataDriven</Subtitle>

        <form onSubmit={handleLogin}>

          {/* Email */}
          <Input
            type="email"
            placeholder="E-mail corporativo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Senha com olhinho */}
          <div style={{ position: "relative", width: "100%" }}>
            <Input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <div
              onClick={() => setMostrarSenha(!mostrarSenha)}
              style={{
                position: "absolute",
                right: "12px",
                top: "45%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#bfbfbf",
              }}
            >
              {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <Button type="submit">Entrar</Button>
        </form>

        <RegisterLink>
          Não tem uma conta? <a onClick={() => navigate("/")}>Registrar</a>
        </RegisterLink>
      </Card>
    </Container>
  );
}

export default Login;