// Função para validar o CNPJ
export function validateCNPJ(cnpj: string): boolean {
  const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return regex.test(cnpj);
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
