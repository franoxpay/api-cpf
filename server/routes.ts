import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const CPF_API_URL = "http://185.228.72.8:8080/pessoas";

function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");
  return cleaned.length === 11 && /^\d{11}$/.test(cleaned);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/cpf", async (req, res) => {
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
      const apiUrl = `${CPF_API_URL}/?cpf=${cleanedCPF}`;
      
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

      const data = await response.json();

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
