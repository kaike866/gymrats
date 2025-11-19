const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema({
  name: String,
  func: String,
  date: String,
  signature: String, // base64
  locked: { type: Boolean, default: false }
});

const AssinaturaSchema = new mongoose.Schema({
  blocks: [BlockSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Assinatura", AssinaturaSchema);
