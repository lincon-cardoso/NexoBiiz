// Função para validar o CNPJ
export function validateCNPJ(cnpj: string): boolean {
  const cleanCNPJ = cnpj.replace(/\D/g, ""); // Remove caracteres não numéricos
  const regex = /^\d{14}$/; // Valida apenas números
  return regex.test(cleanCNPJ);
}

// Função para formatar progressivamente o CNPJ
export function formatCNPJ(cnpj: string): string {
  const cleanValue = cnpj.replace(/\D/g, "");
  let formattedValue = "";

  for (let i = 0; i < cleanValue.length; i++) {
    if (i === 2) formattedValue += ".";
    if (i === 5) formattedValue += ".";
    if (i === 8) formattedValue += "/";
    if (i === 12) formattedValue += "-";
    formattedValue += cleanValue[i];
  }

  return formattedValue;
}
