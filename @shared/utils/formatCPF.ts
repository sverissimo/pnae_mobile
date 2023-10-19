export function formatCPF_CNPJ(document: string | undefined) {
  if (typeof document !== "string") return document;
  if (document.length === 11) {
    return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"); // Format CPF
  } else if (document.length === 14) {
    return document.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    ); // Format CNPJ
  } else {
    return document; // No formatting if length doesn't match
  }
}

// Function to unformat CPF or CNPJ (remove ., - or /)
export function unformatCPF(formattedDocument: string): string {
  const unformattedDocument = formattedDocument.replace(/[.-/]/g, "");
  return unformattedDocument;
}

export function parseCPF(input: string): string {
  const unformattedInput = input.replace(/[.-]/g, "");

  if (unformattedInput.length <= 3) {
    return unformattedInput;
  } else if (unformattedInput.length <= 6) {
    return `${unformattedInput.substring(0, 3)}.${unformattedInput.substring(
      3
    )}`;
  } else if (unformattedInput.length <= 9) {
    return `${unformattedInput.substring(0, 3)}.${unformattedInput.substring(
      3,
      3
    )}.${unformattedInput.substring(6)}`;
  } else {
    return `${unformattedInput.substring(0, 3)}.${unformattedInput.substring(
      3,
      3
    )}.${unformattedInput.substring(6, 3)}-${unformattedInput.substring(9)}`;
  }
}
