const express = require("express");
const router = express.Router();
const Assinatura = require("../models/Assinatura");

// 🔧 Nome fixo do documento usado em TODAS as rotas
const DOC_NAME = "documento-principal";

const { authAdmin } = require("../middleware/authAdmin.js");

router.put("/block/:index", authAdmin, async (req, res) => {

  try {
    const { index } = req.params;
    const { name, func, date, signature } = req.body;

    let doc = await Assinatura.findOne({ documentName: DOC_NAME });
    if (!doc) return res.status(404).json({ error: "Documento não encontrado" });

    if (!doc.blocks[index]) {
      return res.status(400).json({ error: "Bloco inválido." });
    }

    // Permitir somente admin (precisa middleware)
    if (!req.user?.isAdmin) {
      return res.status(403).json({ error: "Apenas administrador pode editar." });
    }

    // Atualiza bloco
    doc.blocks[index] = {
      ...doc.blocks[index],
      name,
      func,
      date,
      signature,
      locked: true, // continua travado
    };

    await doc.save();

    res.json({ message: "Bloco alterado!", doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao editar bloco." });
  }
});

router.post("/block/:index", async (req, res) => {
  try {
    const { index } = req.params;
    const { name, func, date, signature } = req.body;

    let doc = await Assinatura.findOne({ documentName: DOC_NAME });
    if (!doc) return res.status(404).json({ error: "Documento não encontrado" });

    if (!doc.blocks[index]) {
      return res.status(400).json({ error: "Bloco inválido." });
    }

    // Atualiza bloco com a assinatura do usuário
    doc.blocks[index] = {
      ...doc.blocks[index],
      name,
      func,
      date,
      signature,
      locked: true, // usuário normal trava o bloco
    };

    await doc.save();

    res.json({ message: "Bloco assinado!", doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao assinar bloco." });
  }
});



// 🔹 CARREGAR DOCUMENTO --------------------------------------------
router.get("/doc", async (req, res) => {
  try {
    let doc = await Assinatura.findOne({ documentName: DOC_NAME });

    if (!doc) {
      doc = await Assinatura.create({
        documentName: DOC_NAME,
        blocks: [{}, {}, {}, {}],
      });
    }

    return res.json(doc);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao carregar documento." });
  }
});

// 🔹 RESETAR DOCUMENTO ---------------------------------------------
router.post("/reset", async (req, res) => {
  try {
    const defaultBlocks = [
      { name: "", func: "", date: "", signature: "", locked: false },
      { name: "", func: "", date: "", signature: "", locked: false },
      { name: "", func: "", date: "", signature: "", locked: false },
      { name: "", func: "", date: "", signature: "", locked: false },
    ];

    await Assinatura.updateOne(
      { documentName: DOC_NAME },
      {
        $set: {
          blocks: defaultBlocks,
        },
      },
      { upsert: true }
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao resetar" });
  }
});

// Exporta router corretamente
module.exports = router;
