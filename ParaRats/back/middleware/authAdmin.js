const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token não fornecido." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Se for admin fixo, já libera
    if (decoded.email === "admin@paranoa.com" && decoded.isAdmin) {
      req.user = decoded;
      return next();
    }

    // Verifica admin do banco (caso exista)
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ error: "Apenas administrador." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Erro no authAdmin:", err);
    return res.status(403).json({ error: "Token inválido." });
  }
};
