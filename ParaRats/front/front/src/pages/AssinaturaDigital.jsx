// ...existing code...
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Signature from "@lemonadejs/signature/dist/react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/* ====== ESTILOS GERAIS ====== */
const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fbff 0%, #e3f2fd 100%);
  font-family: "Poppins", sans-serif;
  color: #0d47a1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const ExportWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 28px auto;
  background: white;
  border-radius: 8px;
  padding: 22px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
`;

/* ====== CABEÇALHO ====== */
const HeaderRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 12px;
`;

const LogoBox = styled.div`
  width: 110px;
  height: 70px;
  background: white;
  border: 2px solid #1976d2;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 6px;
`;

const LogoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const HeaderInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const UserInfo = styled.div`
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
`;

/* ... rest of styled components unchanged ... */

const RevisionTable = styled.div`
  width: 100%;
  border-collapse: collapse;
  margin-top: 6px;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  gap: 6px;

  & > div {
    padding: 6px 8px;
    border: 1px solid #1976d2;
    font-size: 0.85rem;
    background: #f9fbff;
  }
`;

const Title = styled.h1`
  margin: 8px 0 6px;
  font-size: 1.05rem;
  color: #0d47a1;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #1976d2;
  border-radius: 6px;
  font-size: 0.95rem;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #1976d2;
  border-radius: 6px;
  font-size: 0.95rem;
  min-height: 76px;
  resize: vertical;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const SignaturesArea = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
`;

const SigBlock = styled.div`
  border: 2px solid #1976d2;
  padding: 10px;
  border-radius: 8px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
`;

const SigLine = styled.div`
  height: 100px;
  border-top: 2px solid #1976d2;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #f9f9f9;
  border-radius: 4px;
`;

const SigImg = styled.img`
  max-height: 90px;
  width: auto;
  object-fit: contain;
  cursor: zoom-in;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 22px 0 36px;
`;

const Button = styled.button`
  background: ${(p) => p.bg || "#2196f3"};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: 0.2s;

  &:hover {
    opacity: 0.9;
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

/* ====== FUNÇÃO UTIL ====== */
function today() {
  return new Date().toLocaleDateString();
}

/* ====== CONFIGURAÇÃO DE ADMIN (ajuste o email conforme necessário) ====== */
const ADMIN_EMAIL = "admin@paranoa.com"; // altere para o e‑mail do administrador real

/* ====== COMPONENTE PRINCIPAL ====== */
export default function AssinaturaDigital() {
  const [docNumber, setDocNumber] = useState("0");
  const [revisionDesc, setRevisionDesc] = useState("Elaboração Inicial");
  const [revisedBy, setRevisedBy] = useState("");
  const [revisionDate, setRevisionDate] = useState(today());
  const [title, setTitle] = useState("FGI 477 — Histórico de Revisão");
  const [description, setDescription] = useState(
    "Descrição breve do documento / alteração realizada..."
  );

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

  // --- Autenticação local (lê do localStorage setado pelo componente Login) ---
  const [currentUser, setCurrentUser] = useState(null); // { email, isAdmin }
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

    // carrega histórico (sempre disponível no localStorage, mas vamos exibir só para admin)
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

  function updateBlock(index, field, value) {
    setBlocks((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

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

  /* ====== GERAR PDF (APENAS ADMIN) ====== */
  async function handleExportPDF() {
    if (!currentUser?.isAdmin) {
      alert("Apenas administrador pode gerar PDF.");
      return;
    }

    if (!exportRef.current) return;

    // Esconde botões temporariamente
    const buttons = document.querySelectorAll(".no-print");
    buttons.forEach((btn) => (btn.style.display = "none"));

    const canvas = await html2canvas(exportRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    // Restaura botões
    buttons.forEach((btn) => (btn.style.display = ""));

    const image = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(image);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;
    pdf.addImage(image, "PNG", 0, 0, pageWidth, imgHeight);
    const filename = `historico_revisao_${new Date().toISOString().split("T")[0]}.pdf`;
    pdf.save(filename);

    // salvar entrada no histórico (não armazenamos imagens)
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
      blocks: blocks.map((b) => ({ key: b.key, name: b.name, func: b.func, date: b.date, hasSignature: !!b.signature })),
    };
    const next = [entry, ...history].slice(0, 200);
    persistHistory(next);
  }

  function clearHistory() {
    if (!currentUser?.isAdmin) return;
    if (!confirm("Limpar todo o histórico?")) return;
    persistHistory([]);
  }

  return (
    <Page>
      <ExportWrapper ref={exportRef}>
        <HeaderRow>
          <LogoBox>
            <LogoImg
              src="https://www.paranoa.com.br/images/logo/logo-light.svg"
              alt="Logo Paranoá"
            />
          </LogoBox>

          <HeaderInfo>
            {/*
  ===================================================================
  1. CAMPOS DE DADOS (Documento, Nº, Descrição da Revisão)
  ===================================================================
  */}

            {/* A. Versão EDITÁVEL para o ADMIN */}
            {currentUser?.isAdmin && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  {/* Documento */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "#444", fontWeight: 700 }}>Documento</div>
                    <StyledInput value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  {/* Nº */}
                  <div style={{ width: 200 }}>
                    <div style={{ fontSize: 12, color: "#444", fontWeight: 700 }}>Nº</div>
                    <StyledInput value={docNumber} onChange={(e) => setDocNumber(e.target.value)} />
                  </div>
                </div>

                {/* Descrição da Revisão */}
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 12, color: "#444", fontWeight: 700 }}>Descrição da Revisão</div>
                  <StyledInput value={revisionDesc} onChange={(e) => setRevisionDesc(e.target.value)} />
                </div>
              </>
            )}

            {/* B. Versão APENAS LEITURA para o USUÁRIO COMUM */}
            {currentUser?.isAdmin && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  {/* Documento */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "#444", fontWeight: 700 }}>Documento</div>
                    <div style={{ padding: "6px 8px", border: "1px solid #ddd", borderRadius: 4, background: "#f9f9f9" }}>{title}</div>
                  </div>
                  {/* Nº */}
                  <div style={{ width: 200 }}>
                    <div style={{ fontSize: 12, color: "#444", fontWeight: 700 }}>Nº</div>
                    <div style={{ padding: "6px 8px", border: "1px solid #ddd", borderRadius: 4, background: "#f9f9f9" }}>{docNumber}</div>
                  </div>
                </div>

                {/* Descrição da Revisão */}
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 12, color: "#444", fontWeight: 700 }}>Descrição da Revisão</div>
                  <div style={{ padding: "6px 8px", border: "1px solid #ddd", borderRadius: 4, background: "#f9f9f9" }}>{revisionDesc}</div>
                </div>
              </>
            )}

            {/*
  ===================================================================
  2. TABELA DE REVISÃO (Campo 'Revisado por' é o diferencial)
  ===================================================================
  */}

            {/* A. Tabela para ADMIN (editável 'Revisado por') */}
            {currentUser?.isAdmin && (
              <RevisionTable>
                {/* Cabeçalho */}
                <div style={{ fontWeight: 700 }}>Nº</div>
                <div style={{ fontWeight: 700 }}>Descrição da Revisão</div>
                <div style={{ fontWeight: 700 }}>Revisado por</div>
                <div style={{ fontWeight: 700 }}>Data</div>

                {/* Conteúdo */}
                <div>{docNumber}</div>
                <div>{revisionDesc}</div>
                <div>
                  <StyledInput
                    value={revisedBy}
                    onChange={(e) => setRevisedBy(e.target.value)}
                    placeholder="Digite o nome"
                  />
                </div>
                <div>{revisionDate}</div>
              </RevisionTable>
            )}

            {/* B. Tabela para USUÁRIO NORMAL (não-editável 'Revisado por') */}
            {currentUser?.isAdmin && (
              <RevisionTable>
                {/* Cabeçalho */}
                <div style={{ fontWeight: 700 }}>Nº</div>
                <div style={{ fontWeight: 700 }}>Descrição da Revisão</div>
                <div style={{ fontWeight: 700 }}>Revisado por</div>
                <div style={{ fontWeight: 700 }}>Data</div>

                {/* Conteúdo: usuário normal vê somente valores */}
                <div>{docNumber}</div>
                <div>{revisionDesc}</div>
                <div>
                  {/* Apenas exibe o valor sem o input */}
                  <div style={{ padding: "6px 8px", color: "#333" }}>{revisedBy || "-"}</div>
                </div>
                <div>{revisionDate}</div>
              </RevisionTable>
            )}
          </HeaderInfo>


        </HeaderRow>

        {currentUser?.isAdmin && (
          <div style={{ marginTop: 16 }}>
            <Title>{title}</Title>
            <StyledTextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        )}

        <SignaturesArea>
          {blocks.map((b, i) => (
            <SigBlock key={b.key}>
              <div>
                <SigHeader>{b.label}</SigHeader>
                <SigField>
                  <div style={{ fontWeight: 700 }}>NOME:</div>
                  <StyledInput
                    value={b.name}
                    onChange={(e) => updateBlock(i, "name", e.target.value)}
                  />
                </SigField>
                <SigField>
                  <div style={{ fontWeight: 700 }}>FUNÇÃO:</div>
                  <StyledInput
                    value={b.func}
                    onChange={(e) => updateBlock(i, "func", e.target.value)}
                  />
                </SigField>
                <SigField>
                  <div style={{ fontWeight: 700 }}>DATA:</div>
                  <StyledInput
                    value={b.date}
                    onChange={(e) => updateBlock(i, "date", e.target.value)}
                  />
                </SigField>
              </div>

              <SigLine>
                {!b.signature ? (
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>
                      Assinatura
                    </div>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
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
                        onClick={() => clearSigning(i)}
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
                    onClick={() => setZoomed(b.signature)}
                  />
                )}
              </SigLine>

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
                      <div>
                        <button
                          onClick={() => setActiveSigning(null)}
                          style={{
                            border: "none",
                            background: "#f5f5f5",
                            padding: "6px 10px",
                            borderRadius: 6,
                            cursor: "pointer",
                            marginRight: 8,
                          }}
                        >
                          Cancelar
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
                        }}
                      >
                        <button
                          onClick={() => clearSigning(i)}
                          style={{
                            border: "none",
                            background: "#f44336",
                            color: "white",
                            padding: "6px 10px",
                            borderRadius: 6,
                            cursor: "pointer",
                          }}
                        >
                          Limpar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </SigBlock>
          ))}
        </SignaturesArea>

        {/* Histórico visível apenas para admin */}
        {currentUser?.isAdmin && (
          <div style={{ marginTop: 18 }}>
            <Title>Histórico de Geração</Title>
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 14, color: "#333" }}>{history.length} registros</div>
                <div>
                  <Button bg="#f44336" onClick={clearHistory}>Limpar Histórico</Button>
                </div>
              </div>

              <div style={{ marginTop: 10, maxHeight: 220, overflow: "auto", border: "1px solid #eee", padding: 8, borderRadius: 6, background: "#fafafa" }}>
                {history.length === 0 ? (
                  <div style={{ color: "#666" }}>Sem registros.</div>
                ) : (
                  history.map((h) => (
                    <div key={h.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{h.filename}</div>
                      <div style={{ fontSize: 12, color: "#555" }}>{new Date(h.date).toLocaleString()} — por {h.exportedBy}</div>
                      <div style={{ fontSize: 12, color: "#333", marginTop: 6 }}>
                        Doc: {h.docNumber} — {h.title}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </ExportWrapper>

      {/* Botões fora do export */}
      <Actions className="no-print">
        {currentUser?.isAdmin ? (
          <Button bg="#4caf50" onClick={handleExportPDF}>
            📄 Gerar PDF
          </Button>
        ) : (
          <Button bg="#999" onClick={() => alert("Apenas administrador pode gerar PDF.")}>
            📄 Gerar PDF (somente admin)
          </Button>
        )}

        <Button onClick={() => window.location.reload()}>
          ♻️ Resetar
        </Button>
      </Actions>

      <Footer>
        <div>FGI 477 rev.03</div>
        <div style={{ color: "#999", fontSize: 12 }}>
          ©️ 2025 - Assinatura Digital Kaike
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
// ...existing code...