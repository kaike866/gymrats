const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { auth } = require("../middleware/auth");

router.post("/register", userController.registrarUsuario);
router.post("/login", userController.loginUsuario);

router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
