import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || ""; // Certifique-se de definir SECRET_KEY no arquivo .env

// Helper para requisições autenticadas com acesso via JWT e refresh token
// Salva accessToken no localStorage e renova quando expira via /api/refresh

/**
 * Helper para requisições autenticadas com cookies HttpOnly
 * Apenas inclui credenciais.
 */
export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  return fetch(input, {
    ...init,
    credentials: "include",
  });
}

export function encryptData(data: Record<string, unknown>): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
}

export function decryptData(encryptedData: string): Record<string, unknown> {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
