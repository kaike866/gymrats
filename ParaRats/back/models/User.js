const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true }
});

// Hash antes de salvar
UserSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

// Método para comparar senha
UserSchema.methods.compararSenha = async function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model("User", UserSchema);
