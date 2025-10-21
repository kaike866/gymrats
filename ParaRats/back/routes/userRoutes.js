const express = require('express');
const router = express.Router();
const {
  registrarUsuario,
  loginUsuario,
  listarUsuarios,
  atualizarUsuario,
  deletarUsuario
} = require('../controllers/userController');

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/', listarUsuarios);
router.put('/:id', atualizarUsuario);
router.delete('/:id', deletarUsuario);

module.exports = router;
