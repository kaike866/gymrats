// ...existing code...
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Signature from "@lemonadejs/signature/dist/react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import api from "../api";
import logoParanoa from "../assets/logo-light.svg";

const Page = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 0;

  @media (max-width: 768px) {
    padding: 10px 0;
  }
`;
const ExportWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 28px auto;
  background: white;
  border-radius: 8px;
  padding: 22px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 16px;
    margin: 12px;
  }
`;
const HeaderRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;
  }
`;
const LogoBox = styled.div`
  width: 130px;
  height: 60px;
  background: white;
  border: 2px solid #1976d2;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 4px;
  overflow: hidden; /* impede a logo de sair */
`;
const LogoImg = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
  image-rendering: -webkit-optimize-contrast;
`;
const HeaderInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 768px) {
    width: 100%;
    gap: 18px;
  }
`;
const UserInfo = styled.div`
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
`;
const RevisionTable = styled.div`
  width: 100%;
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  gap: 8px;

  & > div {
    padding: 8px 10px;
    border: 1px solid #1976d2;
    font-size: 0.9rem;
    background: #f9fbff;
    border-radius: 6px;
  }

  /* MOBILE — vira cards visualmente perfeitos */
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 14px;

    & > div {
      display: flex;
      flex-direction: column;
      text-align: left;
      font-size: 1rem;
      border-radius: 10px;
      padding: 12px;
      border: 1px solid #b3d1f7;
    }

    /* Remove layout de "colunas" no mobile */
    & > div:nth-child(1),
    & > div:nth-child(2),
    & > div:nth-child(3),
    & > div:nth-child(4) {
      font-weight: 700;
      font-size: 1.05rem;
      background: #e9f2ff;
    }
  }
`;
const StyledInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #1976d2;
  border-radius: 6px;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 1.05rem;
    padding: 12px;
  }
`;
const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #1976d2;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 90px;
  resize: vertical;

  @media (max-width: 768px) {
    font-size: 1.05rem;
    padding: 14px;
  }
`;
const SignaturesArea = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
const SigBlock = styled.div`
  border: 2px solid #1976d2;
  padding: 10px;
  border-radius: 8px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  min-height: 280px;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%; /* impede overflow */

  @media (max-width: 768px) {
    padding: 12px;
  }
`;
const SigHeader = styled.div`
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 6px;
  color: #0d47a1;
`;
const SigField = styled.div`
  font-size: 0.85rem;
  margin: 6px 0;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
`;
const SigLine = styled.div`
  height: 110px;
  border-top: 2px solid #1976d2;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  border-radius: 4px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 100px;
  }
`;
const SigImg = styled.img`
  max-height: 90px;
  max-width: 100%;
  width: auto;
  object-fit: contain;
  cursor: zoom-in;
`;
const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;

  border-left: 4px solid #3b82f6;
  padding-left: 10px;
`;
const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;

  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
  margin-bottom: 28px;
`;
const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;

  width: 100%;
  max-width: 520px;
  margin: 45px auto;

  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);

  padding: 28px;
  border-radius: 18px;

  border: 1px solid rgba(226, 232, 240, 0.7);
  box-shadow: 0 8px 25px rgba(0,0,0,0.06);

  @media (max-width: 768px) {
    padding: 20px;
    width: 95%;
  }
`;
const AdminBox = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;
const SelectStyled = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: 10px;

  border: 1px solid #cbd5e1;
  font-size: 15px;

  background: #fff;
  transition: 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
    outline: none;
  }
`;
const HistoryBox = styled(Card)`
  margin-top: 30px;
`;
const HistoryList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  padding-right: 4px;
`;
const Section = styled.div`
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 20px;
  margin-top: 40px;
`;
const Button = styled.button`
  background: ${(p) => p.bg || "#2563eb"};
  color: white;
  font-weight: 600;
  font-size: 0.95rem;

  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  cursor: pointer;

  width: 100%;
  max-width: 260px;

  transition: 0.2s ease;

  &:hover {
    opacity: 0.95;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0px);
  }
`;
const Footer = styled.footer`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 36px;
  font-size: 0.85rem;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 6px;
    text-align: center;
    font-size: 0.8rem;
  }
`;
const ZoomOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;
const ZoomImage = styled.img`
  max-width: 92%;
  max-height: 86%;
  border-radius: 6px;
  background: white;
  padding: 8px;
`;
function today() {
  return new Date().toLocaleDateString();
}
const ADMIN_EMAIL = "admin@paranoa.com";
export default function AssinaturaDigital() {

  const [docNumber, setDocNumber] = useState("0");
  const [revisionDesc, setRevisionDesc] = useState("Elaboração Inicial");
  const [revisedBy, setRevisedBy] = useState("");
  const [revisionDate, setRevisionDate] = useState(today());
  const [title, setTitle] = useState("FGI 477 — Histórico de Revisão");
  const [description, setDescription] = useState(
    "Descrição breve do documento / alteração realizada..."
  );

  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setLoggedUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (loggedUser?.isAdmin) {
      if (!title) setTitle("FGI 477 — Histórico de Revisão");
      if (!docNumber) setDocNumber("0");
      if (!revisionDesc) setRevisionDesc("Elaboração Inicial");
    }
  }, [loggedUser]);

  const [blocks, setBlocks] = useState([
    { key: "elaborado", label: "ELABORADO POR:", name: "", func: "Qualidade", date: "", signature: null },
    { key: "aprov1", label: "APROVADO POR:", name: "", func: "", date: "", signature: null },
    { key: "aprov2", label: "APROVADO POR:", name: "", func: "", date: "", signature: null },
    { key: "aprov3", label: "APROVADO POR:", name: "", func: "", date: "", signature: null },
  ]);

  const sigRefs = useRef([React.createRef(), React.createRef(), React.createRef(), React.createRef()]);
  const [activeSigning, setActiveSigning] = useState(null);
  const [zoomed, setZoomed] = useState(null);
  const exportRef = useRef();

  const [currentUser, setCurrentUser] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const storedIsAdmin = localStorage.getItem("isAdmin");
    const isAdmin = storedIsAdmin ? storedIsAdmin === "1" : (email === ADMIN_EMAIL);
    if (email) {
      setCurrentUser({ email, isAdmin });
    } else {
      setCurrentUser(null);
    }

    try {
      const raw = localStorage.getItem("assinatura_history");
      if (raw) setHistory(JSON.parse(raw));
    } catch (e) {
      setHistory([]);
    }
  }, []);

  function persistHistory(next) {
    try {
      localStorage.setItem("assinatura_history", JSON.stringify(next));
    } catch (e) {
      console.error("Erro salvando histórico:", e);
    }
    setHistory(next);
  }


  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setCurrentUser(null);
  }

  const updateBlock = (index, field, value) => {
    setBlocks(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
        edited: currentUser?.isAdmin ? true : updated[index].edited,
      };
      return updated;
    });
  };


  function startSigning(index) {
    const r = sigRefs.current[index]?.current;
    if (r && r.value) r.value = [];
    setActiveSigning(index);
  }

  function clearSigning(index) {
    const r = sigRefs.current[index]?.current;
    if (r && r.value) r.value = [];
  }

  function concludeSigning(index) {
    const r = sigRefs.current[index]?.current;
    if (!r) return;
    const img = r.getImage();
    if (!img) {
      alert("Por favor, faça sua assinatura antes de concluir.");
      return;
    }
    const newDate = today();
    updateBlock(index, "signature", img);
    updateBlock(index, "date", newDate);
    setActiveSigning(null);
  }

  const [selectedNumber, setSelectedNumber] = useState("");

  const phoneList = [
    { name: "Responsável 1", number: "11983626392" },
    { name: "Responsável 2", number: "11954995521" },
  ];


  function enviarWhatsApp(filename) {
    if (!selectedNumber) {
      alert("Selecione um número de WhatsApp para enviar.");
      return;
    }

    const message =
      `O documento *${filename}* foi gerado.\n\n` +
      `Verifique o arquivo *${filename}* abaixo.`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${selectedNumber}?text=${encoded}`;

    window.open(url, "_blank");
  }
  async function handleExportPDF() {
    if (!currentUser?.isAdmin) {
      alert("Apenas administrador pode gerar PDF.");
      return;
    }

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const margin = 14;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let y = margin;
      const defaultLineHeight = 6;
      const signatureHeight = 20;
      const spacing = 10;

      // Adicionar logo
      try {
        const logoImg = await fetch(
          "https://www.paranoa.com.br/images/logo/logo-light.svg"
        ).then((r) => r.text());
        pdf.addImage(logoImg, "SVG", margin, y, 32, 22);
      } catch (e) { }

      // Título e número do documento
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text(title || "Documento", margin + 40, y + 8);

      pdf.setFontSize(11);
      pdf.text(`Nº: ${docNumber}`, margin + 40, y + 16);
      y += 30;

      pdf.setLineWidth(0.3);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 10;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("Informações do Documento", margin, y);
      y += 8;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);

      // Conteúdo textual com quebra automática de linha
      const descriptionLines = pdf.splitTextToSize(`Descrição do Documento: ${description || "-"}`, pageWidth - 2 * margin);
      descriptionLines.forEach(line => { pdf.text(line, margin, y); y += defaultLineHeight; });

      const revisionLines = pdf.splitTextToSize(`Descrição da Revisão: ${revisionDesc || "-"}`, pageWidth - 2 * margin);
      revisionLines.forEach(line => { pdf.text(line, margin, y); y += defaultLineHeight; });

      const revisedByLines = pdf.splitTextToSize(`Revisado por: ${revisedBy || "-"}`, pageWidth - 2 * margin);
      revisedByLines.forEach(line => { pdf.text(line, margin, y); y += defaultLineHeight; });

      const revisionDateLines = pdf.splitTextToSize(`Data da Revisão: ${revisionDate || "-"}`, pageWidth - 2 * margin);
      revisionDateLines.forEach(line => { pdf.text(line, margin, y); y += defaultLineHeight; });

      y += 6;
      pdf.setLineWidth(0.3);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 12;

      // Seção de assinaturas
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text("Assinaturas", margin, y);
      y += 10;

      // Preparar blocos com altura total para ajuste de fonte
      let totalBlockHeight = 0;
      const blocksInfo = blocks.map((blk) => {
        const labelLines = pdf.splitTextToSize(blk.label, pageWidth - 2 * margin);
        const nameFuncLine = `Nome: ${blk.name || "-"}     Função: ${blk.func || "-"}`;
        const nameFuncLines = pdf.splitTextToSize(nameFuncLine, pageWidth - 2 * margin - 60);
        const dateLines = pdf.splitTextToSize(`Data: ${blk.date || "-"}`, pageWidth - 2 * margin);
        const blockHeight = defaultLineHeight * (labelLines.length + nameFuncLines.length + dateLines.length) + signatureHeight + spacing * 2;
        totalBlockHeight += blockHeight;
        return { blk, labelLines, nameFuncLines, dateLines, blockHeight };
      });

      // Calcular espaço disponível e escalar fonte se houver sobra
      const availableHeight = pageHeight - margin - y;
      let scale = 1;
      if (totalBlockHeight < availableHeight) {
        scale = availableHeight / totalBlockHeight;
      }
      const lineHeight = defaultLineHeight * scale;
      pdf.setFontSize(11 * scale);

      blocksInfo.forEach(({ blk, labelLines, nameFuncLines, dateLines }) => {
        // Label
        pdf.setFont("helvetica", "bold");
        labelLines.forEach(line => { pdf.text(line, margin, y); y += lineHeight; });

        // Nome + Função + Assinatura
        pdf.setFont("helvetica", "normal");
        nameFuncLines.forEach(line => {
          pdf.text(line, margin, y);
          if (blk.signature) {
            pdf.addImage(blk.signature, "PNG", pageWidth - margin - 60, y - 2, 60, signatureHeight * scale);
          }
          y += lineHeight;
        });

        // Data
        dateLines.forEach(line => { pdf.text(line, margin, y); y += lineHeight; });

        // Linha separadora
        pdf.setLineWidth(0.2);
        pdf.line(margin, y, pageWidth - margin, y);
        y += spacing * scale;
      });

      // Salvar arquivo
      const filename = `historico_revisao_${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(filename);

      // Salvar histórico
      const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        filename,
        title,
        docNumber,
        revisionDesc,
        revisedBy,
        revisionDate,
        exportedBy: currentUser?.email || "unknown",
        blocks: blocks.map(b => ({
          key: b.key,
          name: b.name,
          func: b.func,
          date: b.date,
          hasSignature: !!b.signature,
        })),
      };

      const next = [entry, ...history].slice(0, 200);
      persistHistory(next);

      // Enviar WhatsApp
      enviarWhatsApp(filename);

    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Erro ao gerar PDF.");
    }
  }



  function clearHistory() {
    if (!currentUser?.isAdmin) return;
    if (!confirm("Limpar todo o histórico?")) return;
    persistHistory([]);
  }

  const saveBlock = async (index) => {
    const blk = blocks[index];

    // Usa strings vazias como fallback
    const name = blk.name?.trim() || "";
    const func = blk.func?.trim() || "";
    const date = blk.date?.trim() || "";
    const signature = blk.signature?.trim() || "";

    if (!name || !func || !date || !signature) {
      alert("Preencha todos os campos antes de salvar.");
      return;
    }

    try {
      const res = await fetch(`https://gymrats-11tb.onrender.com/assinaturas/block/${index}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, func, date, signature }),
      });


      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao salvar bloco");
        return;
      }

      // Bloqueia todos os blocos
      const updated = blocks.map((b, i) => ({
        name: b.name || "",
        func: b.func || "",
        date: b.date || "",
        signature: i === index ? signature : b.signature || "",
        locked: true,
      }));

      setBlocks(updated);
      alert("Todos os blocos foram travados após a assinatura!");
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  useEffect(() => {
    async function loadDoc() {
      try {
        const res = await fetch(`https://gymrats-11tb.onrender.com/assinaturas/doc`);

        const data = await res.json();

        if (!data.blocks) return;

        setBlocks(
          data.blocks.map((b, i) => ({
            name: b.name || "",
            func: b.func || (i === 0 ? "Qualidade" : i === 1 ? "Manufatura" : i === 2 ? "Manutenção" : i === 3 ? "Engenharia" : ""),
            date: b.date || "",
            signature: b.signature || "",
            locked: b.locked ?? false,
          }))
        );

        // Carregar outros campos, usando fallback para data atual
        setTitle(data.title || "");
        setDocNumber(data.docNumber || "");
        setRevisionDesc(data.revisionDesc || "");
        setRevisedBy(data.revisedBy || "");
        setRevisionDate(data.revisionDate || today()); // <-- aqui
        setDescription(data.description || "");
      } catch (err) {
        console.error("Erro ao carregar documento:", err);
      }
    }

    loadDoc();
  }, []);


  async function handleReset() {
    if (!currentUser?.isAdmin) {
      alert("Apenas administrador pode Resetar.");
      return;
    }

    if (!confirm("Tem certeza que deseja resetar todas as assinaturas?")) return;

    try {
      const res = await fetch("https://gymrats-11tb.onrender.com/assinaturas/reset", {
        method: "POST",
      });


      const data = await res.json();
      if (!data.ok) {
        alert("Erro ao resetar.");
        return;
      }

      // Reset local
      setBlocks([
        { key: "elaborado", label: "ELABORADO POR:", name: "", func: "Qualidade", date: "", signature: null, locked: false },
        { key: "aprov1", label: "APROVADO POR:", name: "", func: "Manufatura", date: "", signature: null, locked: false },
        { key: "aprov2", label: "APROVADO POR:", name: "", func: "Manutenção", date: "", signature: null, locked: false },
        { key: "aprov3", label: "APROVADO POR:", name: "", func: "Engenharia", date: "", signature: null, locked: false },
      ]);

      alert("Assinaturas resetadas com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar ao servidor.");
    }
  }


  // ====== CONTROLE DE USUÁRIOS (ADMIN) ======
  const [users, setUsers] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);

  // Atualiza campo do usuário individualmente
  function updateUserField(id, field, value) {
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, [field]: value } : u))
    );
  }

  async function loadUsers() {
    try {
      const res = await fetch("https://gymrats-11tb.onrender.com/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      // CORREÇÃO AQUI 👇👇👇
      setUsers(Array.isArray(data) ? data : []);

      setUsersLoaded(true);
    } catch (err) {
      alert("Erro ao carregar usuários.");
    }
  }


  // Salvar alterações do usuário
  async function saveUser(id) {
    const user = users.find((u) => u._id === id);
    if (!user) return;

    try {
      // Monta o payload sem incluir password caso esteja vazio
      const payload = {
        name: user.name,
        email: user.email,
      };

      if (user.tempPass && user.tempPass.trim() !== "") {
        payload.password = user.tempPass.trim();
      }

      const res = await fetch(`https://gymrats-11tb.onrender.com/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });


      // Se a resposta não for JSON, evita crash
      let data;
      try {
        data = await res.json();
      } catch {
        data = { error: "Erro inesperado no servidor." };
      }

      if (!res.ok) {
        alert(data.error || "Erro ao salvar usuário.");
        return;
      }

      alert("Usuário atualizado!");

      // recarrega lista
      loadUsers();

    } catch (err) {
      alert("Erro ao conectar com o servidor.");
    }
  }


  // Excluir usuário
  async function deleteUser(id) {
    if (!confirm("Deseja excluir este usuário?")) return;

    try {
      const res = await fetch(`https://gymrats-11tb.onrender.com/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });


      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao excluir usuário.");
        return;
      }

      alert("Usuário removido!");
      loadUsers();
    } catch (err) {
      alert("Erro ao conectar com servidor.");
    }
  }

  const saveAdminEdit = async (index) => {
    try {
      const block = blocks[index];

      await api.put(`/assinaturas/block/${index}`, {
        name: block.name,
        func: block.func,
        date: block.date,
        signature: block.signature,
      });

      alert("Alteração salva!");

      // 🔥 limpa o estado edited
      setBlocks(prev => {
        const updated = [...prev];
        updated[index].edited = false;
        return updated;
      });

    } catch (err) {
      console.error(err);
      alert("Erro ao salvar alteração");
    }
  };

  const markEdited = (index) => {
    setBlocks(prev => {
      const updated = [...prev];
      updated[index].edited = true;
      return updated;
    });
  };


  return (
    <Page>
      <ExportWrapper ref={exportRef}>
        <HeaderRow>
          <LogoBox>
            <LogoImg src={logoParanoa} alt="Logo Paranoá"
            />
          </LogoBox>

          <HeaderInfo>

            {/* ============================================================
    1. CAMPOS EDITÁVEIS (APENAS ADMIN)
============================================================ */}
            {currentUser?.isAdmin && (
              <>
                {/* Linha: Documento + Número */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  {/* Documento */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#444",
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      Documento
                    </div>
                    <StyledInput
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  {/* Nº (ADMIN EDITA) */}
                  <div style={{ width: 200 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#444",
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      Nº
                    </div>
                    <StyledInput
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                    />
                  </div>
                </div>

                {/* Descrição da Revisão */}
                <div style={{ marginTop: 10 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#444",
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    Descrição da Revisão
                  </div>
                  <StyledInput
                    value={revisionDesc}
                    onChange={(e) => setRevisionDesc(e.target.value)}
                  />
                </div>
              </>
            )}



            {/* ============================================================
      3. TABELA SOMENTE PARA ADMIN
     ============================================================ */}
            {/* TABELA SOMENTE PARA ADMIN */}
            {currentUser?.isAdmin && (
              <RevisionTable>
                <div style={{ fontWeight: 700 }}>Nº</div>
                <div style={{ fontWeight: 700 }}>Descrição da Revisão</div>
                <div style={{ fontWeight: 700 }}>Revisado por</div>
                <div style={{ fontWeight: 700 }}>Data</div>

                {/* Nº */}
                <div>
                  <StyledInput
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                  />
                </div>

                {/* Descrição da Revisão — AGORA COM INPUT */}
                <div>
                  <StyledInput
                    value={revisionDesc}
                    onChange={(e) => setRevisionDesc(e.target.value)}
                    placeholder="Descrição da revisão"
                  />
                </div>

                {/* Revisado por */}
                <div>
                  <StyledInput
                    value={revisedBy}
                    onChange={(e) => setRevisedBy(e.target.value)}
                    placeholder="Digite o nome"
                  />
                </div>

                {/* Data — AGORA COM INPUT */}
                <div>
                  <StyledInput
                    type="date"
                    value={revisionDate}
                    onChange={(e) => setRevisionDate(e.target.value)}
                  />
                </div>
              </RevisionTable>
            )}


          </HeaderInfo>




        </HeaderRow>

        {currentUser?.isAdmin && (
          <div style={{ marginTop: 16 }}>
            <Title>Descrição da Assinatura</Title>
            <StyledTextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        )}


        <SignaturesArea>
          {blocks.map((b, i) => {
            const readyToSave =
              b.name.trim() !== "" &&
              b.func.trim() !== "" &&
              b.date.trim() !== "" &&
              b.signature;

            return (
              <SigBlock key={b.key}>
                <div>
                  <SigHeader>{b.label}</SigHeader>

                  {/* NOME */}
                  <SigField>
                    <div style={{ fontWeight: 700 }}>NOME:</div>
                    <StyledInput
                      value={b.name}
                      onChange={(e) => {
                        updateBlock(i, "name", e.target.value);
                        markEdited(i);
                      }}
                      disabled={b.locked && !currentUser?.isAdmin}
                      readOnly={b.locked && !currentUser?.isAdmin}
                    />
                  </SigField>

                  {/* FUNÇÃO */}
                  <SigField>
                    <div style={{ fontWeight: 700 }}>FUNÇÃO:</div>
                    <StyledInput
                      value={b.func}
                      onChange={(e) => {
                        updateBlock(i, "func", e.target.value);
                        markEdited(i);
                      }}
                      disabled={b.locked && !currentUser?.isAdmin}
                      readOnly={b.locked && !currentUser?.isAdmin}
                    />
                  </SigField>

                  {/* DATA */}
                  <SigField>
                    <div style={{ fontWeight: 700 }}>DATA:</div>
                    <StyledInput
                      value={b.date}
                      onChange={(e) => {
                        updateBlock(i, "date", e.target.value);
                        markEdited(i);
                      }}
                      disabled={b.locked && !currentUser?.isAdmin}
                      readOnly={b.locked && !currentUser?.isAdmin}
                    />
                  </SigField>
                </div>

                {/* ÁREA DE ASSINATURA */}
                <SigLine>
                  {!b.signature ? (
                    <div style={{ textAlign: "center", width: "100%" }}>
                      <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>
                        Assinatura
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={() => startSigning(i)}
                          style={{
                            border: "1px solid #bbb",
                            background: "#fff",
                            padding: "6px 8px",
                            borderRadius: 6,
                            cursor: "pointer",
                          }}
                        >
                          Assinar
                        </button>

                        <button
                          onClick={() => {
                            clearSigning(i);
                            markEdited(i);
                          }}
                          style={{
                            border: "1px solid #bbb",
                            background: "#fff",
                            padding: "6px 8px",
                            borderRadius: 6,
                            cursor: "pointer",
                          }}
                        >
                          Limpar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <SigImg
                      src={b.signature}
                      alt="assinatura"
                      onClick={() => startSigning(i)}
                      style={{ cursor: "zoom-in" }}
                    />
                  )}
                </SigLine>

                {/* 🔥 BOTÃO “SALVAR ALTERAÇÃO” — FORA DO MODAL */}
                {currentUser?.isAdmin && b.edited && (
                  <button
                    onClick={() => saveAdminEdit(i)}
                    style={{
                      marginTop: 12,
                      padding: "8px 12px",
                      background: "#ff9800",
                      color: "white",
                      borderRadius: 6,
                      cursor: "pointer",
                      border: "none",
                      fontWeight: 600,
                    }}
                  >
                    Salvar Alteração
                  </button>
                )}

                {/* BOTÃO SALVAR (USUÁRIO NORMAL) */}
                {!b.locked && readyToSave && !currentUser?.isAdmin && (
                  <button
                    onClick={() => saveBlock(i)}
                    style={{
                      marginTop: 12,
                      padding: "6px 10px",
                      background: "#1976d2",
                      color: "white",
                      borderRadius: 6,
                      cursor: "pointer",
                      border: "none",
                      fontWeight: 600,
                    }}
                  >
                    Salvar
                  </button>
                )}

                {/* MODAL DE ASSINATURA */}
                {activeSigning === i && (
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      background: "rgba(0,0,0,0.5)",
                      zIndex: 20000,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 20,
                    }}
                  >
                    <div
                      style={{
                        width: "95%",
                        maxWidth: 720,
                        background: "#fff",
                        borderRadius: 8,
                        padding: 18,
                        boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ fontWeight: 700, color: "#111" }}>
                          Faça sua assinatura
                        </div>

                        <button
                          onClick={() => setActiveSigning(null)}
                          style={{
                            border: "none",
                            background: "#f5f5f5",
                            padding: "6px 10px",
                            borderRadius: 6,
                            cursor: "pointer",
                          }}
                        >
                          Cancelar
                        </button>
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <Signature
                          ref={sigRefs.current[i]}
                          width={700}
                          height={160}
                          style={{ width: "100%", height: "160px" }}
                          line={2}
                          instructions="Assine aqui"
                        />

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: 8,
                            gap: 8,
                          }}
                        >
                          <button
                            onClick={() => {
                              clearSigning(i);
                              markEdited(i);
                            }}
                            style={{
                              border: "1px solid #bbb",
                              background: "#fff",
                              padding: "6px 8px",
                              borderRadius: 6,
                              cursor: "pointer",
                            }}
                          >
                            Limpar
                          </button>

                          <button
                            onClick={() => concludeSigning(i)}
                            style={{
                              border: "none",
                              background: "#4caf50",
                              color: "white",
                              padding: "8px 12px",
                              borderRadius: 6,
                              cursor: "pointer",
                            }}
                          >
                            Concluir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </SigBlock>
            );
          })}
        </SignaturesArea>

      </ExportWrapper>


      {/* Container geral do painel */}
      <Section>

        {/* Histórico visível apenas para admin */}
        {currentUser?.isAdmin && (
          <HistoryBox>
            <Title>Histórico de Geração</Title>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 14, color: "#475569" }}>
                {history.length} registros
              </div>

              <Button bg="#c0392b" onClick={clearHistory}>
                Limpar Histórico
              </Button>
            </div>

            <HistoryList>
              {history.length === 0 ? (
                <div style={{ color: "#64748b" }}>Sem registros.</div>
              ) : (
                history.map((h) => (
                  <div key={h.id} style={{ padding: "10px 4px", borderBottom: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{h.filename}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>
                      {new Date(h.date).toLocaleString()} — por {h.exportedBy}
                    </div>
                    <div style={{ fontSize: 12, color: "#334155", marginTop: 6 }}>
                      Doc: {h.docNumber} — {h.title}
                    </div>
                  </div>
                ))
              )}
            </HistoryList>
          </HistoryBox>
        )}



        {/* Área de Ações */}
        <Actions className="no-print">

          {/* ADMIN — Gerar PDF + enviar */}
          {currentUser?.isAdmin && (
            <AdminBox>
              <label style={{ fontWeight: 600, fontSize: 14, color: "#374151" }}>
                Enviar para:
              </label>

              <SelectStyled
                value={selectedNumber}
                onChange={(e) => setSelectedNumber(e.target.value)}
              >
                <option value="">Selecione um número...</option>
                {phoneList.map((p, index) => (
                  <option key={index} value={p.number}>
                    {p.name} — {p.number}
                  </option>
                ))}
              </SelectStyled>

              <Button
                bg="#0d6efd"
                onClick={async () => {
                  await handleExportPDF();
                  enviarWhatsApp();
                }}
              >
                📄 Gerar PDF e Enviar
              </Button>
            </AdminBox>
          )}

          {/* Botão PDF somente admin */}
          {!currentUser?.isAdmin && (
            <Card>
              <Button
                bg="#999"
                onClick={() => alert("Apenas administrador pode gerar PDF.")}
              >
                📄 Gerar PDF (somente admin)
              </Button>
            </Card>
          )}

          {/* Reset */}
          <Card>
            {currentUser?.isAdmin ? (
              <Button onClick={handleReset}>Resetar</Button>
            ) : (
              <Button
                bg="#999"
                onClick={() => alert("Apenas administrador pode Resetar.")}
              >
                Resetar (somente admin)
              </Button>
            )}
          </Card>

        </Actions>
      </Section>





      {currentUser?.isAdmin && (
        <div style={{ marginTop: 28 }}>
          <Title
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1e293b",
              marginBottom: 24,
              position: "relative",
              paddingBottom: 8,
            }}
          >
            Usuários Registrados

            <span
              style={{
                position: "absolute",
                width: "70px",
                height: "4px",
                background: "#1976d2",
                bottom: 0,
                left: 0,
                borderRadius: 8,
                opacity: 0.9,
              }}
            ></span>
          </Title>




          {/* Botão carregar */}
          {!usersLoaded && (
            <Button
              onClick={loadUsers}
              bg="#1976d2"
              style={{
                marginBottom: 18,
                padding: "10px 22px",
                fontWeight: 600,
                borderRadius: 10,
                fontSize: 15,
              }}
            >
              Carregar usuários
            </Button>

          )}

          {/* Sem usuários */}
          {usersLoaded && users.length === 0 && (
            <div style={{ color: "#777", marginTop: 10, fontStyle: "italic" }}>
              Nenhum usuário cadastrado.
            </div>
          )}

          {/* Lista */}
          {usersLoaded && users.length > 0 && (
            <div
              style={{
                marginTop: 15,
                padding: 18,
                borderRadius: 14,
                maxHeight: 320,
                overflowY: "auto",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
            >
              {users.map((u) => (
                <div
                  key={u._id}
                  style={{
                    padding: 18,
                    marginBottom: 14,
                    background: "#f8fafc",
                    borderRadius: 14,
                    border: "1px solid #d0d7e2",
                    transition: "0.25s ease",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                  onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(0,0,0,0.10)")
                  }
                  onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 2px 6px rgba(0,0,0,0.05)")
                  }
                >

                  {/* Nome + email */}
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 17,
                      color: "#0f172a",
                      marginBottom: 12,
                    }}
                  >
                    {u.nome} —{" "}
                    <span style={{ fontWeight: 400, color: "#475569" }}>
                      {u.email}
                    </span>
                  </div>


                  {/* Inputs: mobile friendly */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Nome"
                      value={u.nome}
                      onChange={(e) => updateUserField(u._id, "nome", e.target.value)}
                      style={{
                        flex: "1 1 160px",
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                        background: "#fff",
                        fontSize: 14,
                        transition: "0.2s",
                      }}
                    />


                    <input
                      type="email"
                      placeholder="Email"
                      value={u.email}
                      onChange={(e) =>
                        updateUserField(u._id, "email", e.target.value)
                      }
                      style={{
                        flex: "1 1 180px",
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                        background: "#fff",
                        fontSize: 14,
                        transition: "0.2s",
                      }}

                    />

                    <input
                      type="password"
                      placeholder="Nova senha"
                      value={u.senhaTemp || ""}
                      onChange={(e) =>
                        updateUserField(u._id, "senhaTemp", e.target.value)
                      }
                      style={{
                        flex: "1 1 180px",
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                        background: "#fff",
                        fontSize: 14,
                        transition: "0.2s",
                      }}

                    />
                  </div>

                  {/* Botões */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      marginTop: 12,
                    }}
                  >
                    <Button
                      bg="#1759bdff"
                      onClick={() => saveUser(u._id)}
                      style={{
                        padding: "9px 16px",
                        fontWeight: 600,
                        borderRadius: 10,
                        fontSize: 14,
                      }}
                    >
                      Salvar
                    </Button>

                    <Button
                      bg="#f44336"
                      disabled={!currentUser?.isAdmin || u.email === currentUser.email}
                      onClick={() => deleteUser(u._id)}
                      style={{
                        padding: "9px 16px",
                        borderRadius: 10,
                        fontSize: 14,
                        opacity:
                          !currentUser?.isAdmin || u.email === currentUser.email ? 0.5 : 1,
                      }}
                    >
                      Excluir
                    </Button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}






      <Footer>
        <div>FGI 477 rev.03</div>
        <div style={{ color: "#999", fontSize: 12 }}>
          ©️ 2025 - Assinatura Digital Kaike e Gabriel Alencar
        </div>
      </Footer>

      {zoomed && (
        <ZoomOverlay onClick={() => setZoomed(null)}>
          <ZoomImage src={zoomed} alt="assinatura ampliada" />
        </ZoomOverlay>
      )}
    </Page>
  );
}