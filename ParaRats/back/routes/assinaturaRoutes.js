const express = require("express");
const router = express.Router();
const Assinatura = require("../models/Assinatura"); // ajuste para o nome do seu model


// SALVAR BLOCO DE ASSINATURA
router.post("/:docId/block/:index", async (req, res) => {
  try {
    const { docId, index } = req.params;
    const { name, func, date, signature } = req.body;

    // Validação básica
    if (!name || !func || !date || !signature) {
      return res.status(400).json({ error: "Campos incompletos." });
    }

    // Busca o documento
    let doc = await Assinatura.findById(docId);
    if (!doc) {
      return res.status(404).json({ error: "Documento não encontrado." });
    }

    // Garante que blocks existe
    if (!doc.blocks || !doc.blocks[index]) {
      return res.status(400).json({ error: "Bloco inválido." });
    }

    // Atualiza o bloco
    doc.blocks[index].name = name;
    doc.blocks[index].func = func;
    doc.blocks[index].date = date;
    doc.blocks[index].signature = signature;
    doc.blocks[index].locked = true;

    await doc.save();

    return res.json({ message: "Bloco salvo com sucesso!", doc });
  } catch (err) {
    console.error("Erro ao salvar bloco:", err);
    return res.status(500).json({ error: "Erro no servidor." });
  }
});

module.exports = router;
