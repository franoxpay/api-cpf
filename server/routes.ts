import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const CPF_API_URL = process.env.CPF_API_URL;

function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");
  return cleaned.length === 11 && /^\d{11}$/.test(cleaned);
}

function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, "");
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatSexo(sexo: string): string {
  if (sexo === "M") return "Masculino";
  if (sexo === "F") return "Feminino";
  return sexo;
}

function toProperCase(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/cpf", async (req, res) => {
    if (!CPF_API_URL) {
      return res.status(500).json({
        statusCode: 500,
        error: "API não configurada. Contate o administrador."
      });
    }

    const cpf = req.query.cpf as string;
    
    if (!cpf) {
      return res.status(400).json({
        statusCode: 400,
        error: "Parâmetro 'cpf' é obrigatório. Use: /cpf?cpf=12345678901"
      });
    }
    
    const cleanedCPF = cpf.replace(/\D/g, "");

    if (!isValidCPF(cleanedCPF)) {
      return res.status(400).json({
        statusCode: 400,
        error: "Formato de CPF inválido. O CPF deve conter 11 dígitos numéricos."
      });
    }

    try {
      const apiUrl = `${CPF_API_URL}?cpf=${cleanedCPF}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const rawData = await response.json();

      const data = {
        status: response.status,
        cpf: formatCPF(rawData.CPF || cleanedCPF),
        nome: toProperCase(rawData.NOME || ""),
        nascimento: formatDate(rawData.NASC),
        sexo: formatSexo(rawData.SEXO),
        mae: toProperCase(rawData.NOME_MAE || "")
      };

      return res.status(response.status).json({
        statusCode: response.status,
        data
      });

    } catch (error: any) {
      console.error(`[CPF Proxy] Error fetching CPF ${cleanedCPF}:`, error.message);

      if (error.name === "AbortError") {
        return res.status(504).json({
          statusCode: 504,
          error: "Tempo limite excedido ao conectar com a API"
        });
      }

      return res.status(500).json({
        statusCode: 500,
        error: "Erro ao conectar com a API de consulta de CPF"
      });
    }
  });

  return httpServer;
}
