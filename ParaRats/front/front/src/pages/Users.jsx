import React, { useEffect, useState } from "react";
import api from "../api";
import styled from "styled-components";
import { Activity } from "lucide-react";

const Container = styled.div`
  padding: 30px;
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #007bff;
`;

const Form = styled.form`
  display: flex;
  gap: 10px;
  margin: 20px 0;

  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  button {
    background-color: #ffcc00;
    border: none;
    border-radius: 8px;
    padding: 10px 16px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background-color: #ffd633;
    }
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;

  li {
    background: white;
    margin-bottom: 10px;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  button {
    background: #ff4d4d;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;

    &:hover {
      background: #e60000;
    }
  }
`;

function Users() {
  const [users, setUsers] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // 🚀 Verifica se o usuário logado é admin
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail === "admin@gmail.com") {
      setIsAdmin(true);
    }

    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    loadUsers();
  }, []);

  // 🔄 Carrega todos os usuários
  const loadUsers = async () => {
    try {
      const res = await api.get("/");
      setUsers(res.data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    }
  };

  // ➕ Adicionar usuário (apenas admin)
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", { nome, email, senha });
      setNome("");
      setEmail("");
      setSenha("");
      loadUsers();
    } catch (err) {
      alert("Erro ao adicionar usuário!");
    }
  };

  // ❌ Deletar usuário (apenas admin)
  const handleDelete = async (id) => {
    if (!isAdmin) {
      alert("Apenas o administrador pode excluir usuários!");
      return;
    }

    try {
      await api.delete(`/${id}`);
      loadUsers();
    } catch (err) {
      alert("Erro ao excluir usuário!");
    }
  };

  return (
    <Container>
      <Title>
        <Activity /> Usuários Pararats
      </Title>

      {/* Se for admin, mostra tudo */}
      {isAdmin ? (
        <>
          <Form onSubmit={handleAdd}>
            <input
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button type="submit">Adicionar</button>
          </Form>

          <List>
            {users.map((u) => (
              <li key={u._id}>
                <span>
                  {u.nome} — {u.email}
                </span>
                <button onClick={() => handleDelete(u._id)}>Excluir</button>
              </li>
            ))}
          </List>
        </>
      ) : (
        // Se não for admin, mostra só uma mensagem
        <p style={{ marginTop: "40px", color: "#666", fontSize: "18px" }}>
          Você não tem permissão para visualizar os usuários.
        </p>
      )}
    </Container>
  );

}

export default Users;
