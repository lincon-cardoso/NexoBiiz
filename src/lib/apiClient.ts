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
