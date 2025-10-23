import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import styled from "styled-components";
import { Activity, Edit3, Trash2, Save } from "lucide-react";


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
    gap: 10px;
  }

  .edit-fields {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  input {
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  button {
    background: #ff4d4d;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
      background: #e60000;
    }

    &.edit {
      background: #007bff;
      &:hover {
        background: #0056b3;
      }
    }

    &.save {
      background: #00b33c;
      &:hover {
        background: #009933;
      }
    }
  }
`;

function Users() {
  const [users, setUsers] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [editSenha, setEditSenha] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const userRefs = useRef({});


  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail === "admin@gmail.com") setIsAdmin(true);

    const token = localStorage.getItem("token");
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get("/");
      setUsers(res.data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", { nome, email, senha });
      setNome("");
      setEmail("");
      setSenha("");
      loadUsers();
    } catch {
      alert("Erro ao adicionar usuário!");
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return alert("Apenas o administrador pode excluir usuários!");
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      await api.delete(`/${id}`);
      loadUsers();
    } catch {
      alert("Erro ao excluir usuário!");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditEmail(user.email);
    setEditSenha("");
  };

  const handleSaveEdit = async (id) => {
    try {
      // monta payload apenas com campos válidos
      const payload = {};
      if (editEmail && editEmail.trim() !== "") payload.email = editEmail.trim();
      if (editSenha && editSenha.trim() !== "") payload.senha = editSenha.trim();

      if (Object.keys(payload).length === 0) {
        alert("Nenhuma alteração informada.");
        return;
      }

      const res = await api.put(`/users/${id}`, payload);
      alert(res.data?.message || "Usuário atualizado com sucesso!");
      setEditingUser(null);
      setEditEmail("");
      setEditSenha("");
      loadUsers();
    } catch (err) {
      console.error("Erro salvar edição:", err);
      const serverMsg = err.response?.data?.error || "Erro ao salvar alterações.";
      alert(serverMsg);
    }
  };

  const scrollToEmail = () => {
    const user = users.find(u => u.email === searchEmail);
    if (user && userRefs.current[user._id]) {
      userRefs.current[user._id].scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      alert("Usuário não encontrado!");
    }
  };



  return (
    <Container>
      <Title>
        <Activity /> Usuários Pararats
      </Title>

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


          <Form>
            <input
              type="email"
              placeholder="Buscar usuário por e-mail"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <button type="button" onClick={scrollToEmail}>
              Ir para e-mail
            </button>
          </Form>


          <List>
            {users.map((u) => {
              const isHighlighted = searchEmail && u.email.includes(searchEmail);
              return (
                <li
                  key={u._id}
                  ref={(el) => (userRefs.current[u._id] = el)}
                  style={{
                    background: searchEmail && u.email.includes(searchEmail) ? "#ffd633" : "white",
                  }}
                >
                  {editingUser === u._id ? (
                    <div className="edit-fields">
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                      <input
                        type="password"
                        placeholder="Nova senha (opcional)"
                        value={editSenha}
                        onChange={(e) => setEditSenha(e.target.value)}
                      />
                    </div>
                  ) : (
                    <span>
                      {u.nome} — {u.email}
                    </span>
                  )}

                  <div style={{ display: "flex", gap: "6px" }}>
                    {editingUser === u._id ? (
                      <button className="save" onClick={() => handleSaveEdit(u._id)}>
                        <Save size={16} /> Salvar
                      </button>
                    ) : (
                      <button className="edit" onClick={() => handleEdit(u)}>
                        <Edit3 size={16} /> Editar
                      </button>
                    )}
                    <button onClick={() => handleDelete(u._id)}>
                      <Trash2 size={16} /> Excluir
                    </button>
                  </div>
                </li>
              );
            })}
          </List>

        </>
      ) : (
        <p style={{ marginTop: "40px", color: "#149dc7", fontSize: "18px" }}>
          Você não tem permissão para visualizar os usuários.
        </p>
      )}
    </Container>
  );
}

export default Users;
