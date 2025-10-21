const User = require('../models/User');
const jwt = require('jsonwebtoken');

const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Cadastrar novo usuário
exports.registrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ mensagem: 'Usuário já cadastrado' });

    const novoUsuario = await User.create({ nome, email, senha });
    res.status(201).json({
      _id: novoUsuario._id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      token: gerarToken(novoUsuario._id),
    });
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
};

// Login
exports.loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await User.findOne({ email });

    if (usuario && (await usuario.compararSenha(senha))) {
      res.json({
        _id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        token: gerarToken(usuario._id),
      });
    } else {
      res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
};

// Listar todos
exports.listarUsuarios = async (req, res) => {
  const usuarios = await User.find().select('-senha');
  res.json(usuarios);
};

// Atualizar
exports.atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;

  const usuario = await User.findByIdAndUpdate(id, dados, { new: true });
  res.json(usuario);
};

// Deletar
exports.deletarUsuario = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ mensagem: 'Usuário removido com sucesso' });
};
