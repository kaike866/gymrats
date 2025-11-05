import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { LogOut, UserPlus, Home, LogIn } from "lucide-react";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #000; /* Fundo preto */
  padding: 14px 28px;
  font-family: "Poppins", sans-serif;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border-bottom: 3px solid #ffcc00;
  position: sticky;
  top: 0;
  z-index: 999;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.7rem;
  font-weight: 800;
  letter-spacing: -1px;
  cursor: pointer;
  color: #ffcc00;

  span {
    background: #ffcc00;
    color: #000;
    padding: 6px 12px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 1.3rem;
    box-shadow: 0 2px 10px rgba(255, 204, 0, 0.5);
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 16px rgba(255, 204, 0, 0.6);
    }
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: #ffcc00;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.25s ease;

  &:hover {
    background-color: #ffcc00;
    color: #000;
    transform: translateY(-2px);
  }

  svg {
    color: #ffcc00;
    transition: color 0.25s;
  }

  &:hover svg {
    color: #000;
  }
`;

const LogoutButton = styled.button`
  background-color: #ffcc00;
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
    background-color: #ffd633;
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(255, 204, 0, 0.5);
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
      {/* LOGO */}
      <Logo onClick={() => navigate("/assinatura")}>
        <span>DW</span>
      </Logo>

      <Links>
        {/* 🔹 Admin vê o menu Home */}
        {isAdmin && (
          <NavLink to="/assinatura">
            <Home size={18} /> Home
          </NavLink>
        )}

        {/* 🔹 Registrar só aparece quando não há login */}
        {!token && (
          <NavLink to="/">
            <UserPlus size={18} /> Registrar
          </NavLink>
        )}

        {/* 🔹 Alterna entre Login e Sair */}
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
