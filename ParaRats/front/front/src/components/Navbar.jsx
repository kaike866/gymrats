import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { LogOut, UserPlus, Home, LogIn } from "lucide-react";
import logoParanoa from "../assets/paranoalogosemfundo.png";

// 🔹 Microanimação flutuante igual ao Register.jsx
const floatLogo = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
`;

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
background: linear-gradient(90deg, #0b1f3a 0%, #052b6b 100%);

  padding: 14px 32px;
  font-family: "Poppins", sans-serif;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  border-bottom: 2px solid #4f98f7;
  position: sticky;
  top: 0;
  z-index: 999;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  cursor: pointer;
  color: #4f98f7;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.04);
  }

  h1 {
    font-size: 1.6rem;
    letter-spacing: -1px;
    color: #4f98f7;
  }
`;

const AnimatedLogo = styled.img`
  width: 42px;
  height: 42px;
  animation: ${floatLogo} 3s ease-in-out infinite;
  filter: drop-shadow(0 0 6px rgba(79, 152, 247, 0.4));
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
`;

const NavLink = styled(Link)`
  color: #e4e4e4;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.25s ease;

  &:hover {
    background-color: #4f98f7;
    color: #000;
    transform: translateY(-2px);
  }

  svg {
    transition: color 0.25s;
  }

  &:hover svg {
    color: #000;
  }
`;

const LogoutButton = styled.button`
  background-color: #4f98f7;
  border: none;
  color: #000;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 10px #4f98f7;
  }
`;

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const isAdmin = email === "admin@gmail.com";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <NavbarContainer>
      {/* 🔹 LOGO animada */}
      <Logo onClick={() => navigate("/assinatura")}>
        <AnimatedLogo
          src={logoParanoa}
          alt="Paranoá Indústria de Borracha"
        />
        <h1>ARANOÁ</h1>
      </Logo>

      <Links>
        {isAdmin && (
          <NavLink to="/assinatura">
            <Home size={18} /> Home
          </NavLink>
        )}

        {!token && (
          <NavLink to="/">
            <UserPlus size={18} /> Registrar
          </NavLink>
        )}

        {token ? (
          <LogoutButton onClick={handleLogout}>
            <LogOut size={18} /> Sair
          </LogoutButton>
        ) : (
          <NavLink to="/login">
            <LogIn size={18} /> Login
          </NavLink>
        )}
      </Links>
    </NavbarContainer>
  );
}

export default Navbar;
