import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Dumbbell, Flame, Activity } from "lucide-react";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #007bff;
  padding: 14px 28px;
  color: #fff;
  font-family: "Poppins", sans-serif;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  color: #ffcc00;

  &:hover {
    transform: scale(1.05);
    transition: 0.2s;
  }

  svg {
    color: #ffcc00;
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }

  svg {
    color: #ffcc00;
  }
`;

const LogoutButton = styled.button`
  background-color: #ffcc00;
  border: none;
  color: #333;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-color: #ffd633;
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
      <Logo onClick={() => navigate("/dash")}>
        <Dumbbell size={26} />
        Pararats
      </Logo>

      <Links>
        {/* 🔹 Somente o admin vê o menu Usuários */}
        {isAdmin && (
          <NavLink to="/users">
            <Activity size={18} /> Usuários
          </NavLink>
        )}

        {/* 🔹 Registrar só aparece quando NÃO há login */}
        {!token && (
          <NavLink to="/register">
            <Flame size={18} /> Registrar
          </NavLink>
        )}

        {/* 🔹 Alterna entre Login e Sair */}
        {token ? (
          <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </Links>
    </NavbarContainer>
  );
}

export default Navbar;
