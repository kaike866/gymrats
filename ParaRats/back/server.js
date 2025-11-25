const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
// CORS seguro para Netlify + local
const allowedOrigins = [
  "http://localhost:5173",        // desenvolvimento
  "https://gymrats.netlify.app",  // produção no Netlify (troque pelo seu link)
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origem não permitida pelo CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Rotas de assinatura
const assinaturaRoutes = require("./routes/assinaturaRoutes");
app.use("/assinaturas", assinaturaRoutes);


const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api", userRoutes);
app.use("/admin", adminRoutes);



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
app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email já registrado." });
    }

    const newUser = new User({ nome, email, senha });

    await newUser.save();
    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar usuário." });
  }
});



app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    // ADMIN FIXO
    if (email === "admin@paranoa.com" && senha === "admin123") {
      const token = jwt.sign(
        { email, isAdmin: true },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      return res.json({
        token,
        email,
        nome: "Administrador",
        isAdmin: true,
      });
    }

    // USUÁRIO NORMAL
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      return res.status(400).json({ error: "Senha incorreta." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: false },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      email: user.email,
      nome: user.nome,
      isAdmin: false,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
});




// ===== Middleware admin =====
function authAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({ error: "Apenas administrador." });
    }

    next();
  } catch {
    res.status(403).json({ error: "Token inválido." });
  }
}

// ===== Listar usuários (somente admin) =====
app.get("/", authAdmin, async (req, res) => {
  const users = await User.find().select("-senha");
  return res.json(users);
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
