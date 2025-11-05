import React from "react";
import styled from "styled-components";
import { FileText, LogOut } from "lucide-react";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f9fbff, #ffffff);
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  font-family: "Inter", sans-serif;
`;

const Card = styled.div`
  background: #fff;
  width: 100%;
  max-width: 800px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 30px;
  border: 1px solid #f1f1f1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  h1 {
    font-size: 1.5rem;
    color: #1b2a4a;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    font-size: 0.9rem;
    color: #6a7a99;
  }
`;

const LogoutButton = styled.button`
  background: #f3f6fb;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  color: #1b2a4a;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #e7edf8;
  }
`;

const DocumentHeader = styled.div`
  border-bottom: 1px solid #edf0f6;
  margin-bottom: 25px;

  h2 {
    font-size: 1.1rem;
    color: #1b2a4a;
    margin-bottom: 5px;
  }

  span {
    font-size: 0.85rem;
    color: #7d8aa5;
  }
`;

const Section = styled.div`
  background: #fafbff;
  border: 1px solid #eef1f8;
  border-radius: 12px;
  padding: 18px 22px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionInfo = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    color: #1b2a4a;
    font-size: 1rem;
    margin-bottom: 4px;
  }

  span {
    color: #7d8aa5;
    font-size: 0.9rem;
  }
`;

const SignButton = styled.button`
  background: #4b7bff;
  border: none;
  color: #fff;
  font-weight: 500;
  border-radius: 8px;
  padding: 8px 18px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #3d6af3;
  }
`;

export default function AssinaturaDigital() {
  return (
    <Container>
      <Card>
        <Header>
          <div>
            <h1>
              <FileText size={22} />
              Sistema de Assinatura Digital
            </h1>
            <p>Bem-vindo, Gabriel</p>
          </div>

          <LogoutButton>
            <LogOut size={16} />
            Sair
          </LogoutButton>
        </Header>

        <DocumentHeader>
          <h2>Documento FGI 477 rev.03</h2>
          <span>
            Histórico de Revisão - Revisado por: <b>Brenda Alves</b> (28/10/2025)
          </span>
        </DocumentHeader>

        <Section>
          <SectionInfo>
            <strong>Elaborado por</strong>
            <span>Aguardando assinatura</span>
          </SectionInfo>
          <SignButton>Assinar</SignButton>
        </Section>

        <Section>
          <SectionInfo>
            <strong>Aprovado por (Qualidade)</strong>
            <span>Aguardando assinatura</span>
          </SectionInfo>
          <SignButton>Assinar</SignButton>
        </Section>

        <Section>
          <SectionInfo>
            <strong>Aprovado por (Manufatura)</strong>
            <span>Aguardando assinatura</span>
          </SectionInfo>
          <SignButton>Assinar</SignButton>
        </Section>

        <Section>
          <SectionInfo>
            <strong>Aprovado por (Engenharia)</strong>
            <span>Aguardando assinatura</span>
          </SectionInfo>
          <SignButton>Assinar</SignButton>
        </Section>
      </Card>
    </Container>
  );
}
