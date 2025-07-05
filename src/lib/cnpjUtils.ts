// Função para validar o CNPJ
export function validateCNPJ(cnpj: string): boolean {
  const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return regex.test(cnpj);
}

// Função para formatar o CNPJ
export function formatCNPJ(cnpj: string): string {
  const cleanCNPJ = cnpj.replace(/\D/g, "");
  return cleanCNPJ
    .replace(/(\d{2})/, "$1.")
    .replace(/(\d{2}\.\d{3})/, "$1.")
    .replace(/(\d{2}\.\d{3}\.\d{3})/, "$1/")
    .replace(/(\d{2}\.\d{3}\.\d{3}\/\d{4})/, "$1-")
    .slice(0, 18); // Limita ao tamanho máximo do CNPJ formatado
}
