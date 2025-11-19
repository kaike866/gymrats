const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas de assinatura
const assinaturaRoutes = require("./routes/assinaturaRoutes");
app.use("/assinaturas", assinaturaRoutes);

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
    return res.status(403).json({ error: "Token inválido" });
  }
};

// === ROTAS ===

// Registrar
app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email já registrado." });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = new User({ nome, email, senha: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch {
    res.status(500).json({ error: "Erro ao registrar usuário." });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  // Admin
  if (email === "admin@gmail.com" && senha === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email: "admin@gmail.com", role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    return res.json({ token, email });
  }

  // Usuário comum
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Usuário não encontrado." });

  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) return res.status(400).json({ error: "Senha incorreta." });

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  return res.json({ token, email: user.email });
});

// Listar usuários
app.get("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email === "admin@gmail.com") {
      const users = await User.find().select("-senha");
      return res.json(users);
    }

    return res.status(403).json({ error: "Apenas o administrador pode visualizar os usuários." });
  } catch {
    return res.status(403).json({ error: "Token inválido." });
  }
});

// Remover usuário
app.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user?.email !== "admin@gmail.com") {
      return res.status(403).json({ error: "Apenas administrador." });
    }

    await User.findByIdAndDelete(req.params.id);
    return res.json({ message: "Usuário removido!" });
  } catch {
    return res.status(500).json({ error: "Erro ao remover." });
  }
});

// Editar usuário
app.put("/users/:id", auth, async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (req.user?.email !== "admin@gmail.com") {
      return res.status(403).json({ error: "Apenas administrador." });
    }

    const userToUpdate = await User.findById(req.params.id);
    if (!userToUpdate) return res.status(404).json({ error: "Usuário não encontrado." });

    if (email && email !== userToUpdate.email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ error: "Email já usado." });
    }

    const updateData = {};
    if (email) updateData.email = email;
    if (senha) updateData.senha = await bcrypt.hash(senha, 10);

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-senha");

    return res.json({ message: "Usuário atualizado!", user: updatedUser });
  } catch {
    return res.status(500).json({ error: "Erro ao atualizar." });
  }
});

// Iniciar servidor
app.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 4000}`);
});
