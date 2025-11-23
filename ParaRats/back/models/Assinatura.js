const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema({
  name: String,
  func: String,
  date: String,
  signature: String,
  locked: { type: Boolean, default: false }
});

const AssinaturaSchema = new mongoose.Schema({
  documentName: { type: String, required: true, default: "documento-principal" },
  blocks: [BlockSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Assinatura", AssinaturaSchema);
