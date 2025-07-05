// Helper para requisições autenticadas com acesso via JWT e refresh token
// Salva accessToken no localStorage e renova quando expira via /api/refresh

/**
 * Helper para requisições autenticadas com cookies HttpOnly
 * Apenas inclui credenciais.
 */

// Helper para obter CSRF token do cookie
function getCsrfToken() {
  const match = document.cookie.match(/csrf-token=([^;]+)/);
  return match ? match[1] : "";
}

export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const csrfToken = getCsrfToken();
  return fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.headers || {}),
      "x-csrf-token": csrfToken,
    },
  });
}
