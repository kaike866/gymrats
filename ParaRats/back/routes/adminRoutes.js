const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authAdmin } = require("../middleware/authAdmin.js");

// Listar usuários (ADMIN)
router.get("/users", authAdmin, async (req, res) => {
  const users = await User.find().select("-senha");
  res.json(users);
});

// Atualizar usuário (ADMIN)
router.put("/users/:id", authAdmin, async (req, res) => {
  const { email, nome, senha } = req.body;

  const updates = {};
  if (email) updates.email = email;
  if (nome) updates.nome = nome;
  if (senha) updates.senha = await bcrypt.hash(senha, 10);

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  }).select("-senha");

  res.json({ message: "Usuário atualizado", user });
});

// Deletar usuário (ADMIN)
router.delete("/users/:id", authAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Usuário removido!" });
});

module.exports = router;
