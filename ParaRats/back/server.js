const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// === Conexão MongoDB ===
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))

  
  .catch((err) => console.error("Erro Mongo:", err));


  
// === Model ===
const User = require("./models/User");

// === Middleware de autenticação ===
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: "Token inválido" });
  }
};

// === Rotas ===

// Registrar
app.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: "Email já cadastrado" });
  const hashed = await bcrypt.hash(senha, 10);
  const user = new User({ nome, email, senha: hashed });
  await user.save();
  res.json({ message: "Usuário criado com sucesso!" });
});

// Login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) return res.status(400).json({ error: "Senha incorreta" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

  res.json({ token, email: user.email }); // 👈 Enviando também o email
});


// Listar usuários
app.get("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  // Se o token não existe, verifica se é o admin local
  if (!token && req.headers.email === "admin@gmail.com") {
    const users = await User.find();
    return res.json(users);
  }

  // Caso contrário, segue a autenticação normal
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const users = await User.find();
    res.json(users);
  } catch {
    res.status(403).json({ error: "Token inválido" });
  }
});


// Deletar usuário (somente admin)
app.delete("/:id", auth, async (req, res) => {
  const user = await User.findById(req.user.id); // quem está logado

  // Verifica se é o admin
  if (user.email !== "admin@gmail.com") {
    return res.status(403).json({ error: "Acesso negado: apenas o admin pode excluir usuários." });
  }

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Usuário removido com sucesso." });
});


app.listen(process.env.PORT || 4000, () =>
  console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 4000}`)
);
