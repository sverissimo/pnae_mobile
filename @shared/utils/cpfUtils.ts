export const formatCPF = (input: string): string => {
  const numbers = input.replace(/\D/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9)
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
    6,
    9
  )}-${numbers.slice(9, 11)}`;
};

export const formatCNPJ = (input: string): string => {
  const numbers = input.replace(/\D/g, "");
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  if (numbers.length <= 8)
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  if (numbers.length <= 12)
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(
      5,
      8
    )}/${numbers.slice(8)}`;
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(
    5,
    8
  )}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
};

export const isValidCPF = (cpf: string): boolean => {
  const strCPF = cpf.replace(/\D/g, "");
  let sum = 0;
  let remainder;

  if (strCPF === "00000000000") return false;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(strCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(strCPF.substring(10, 11))) return false;

  return true;
};

export const isValidCNPJ = (input: string): boolean => {
  const cnpj = input.replace(/[^\d]+/g, "");

  if (cnpj.length !== 14) return false;

  // Eliminate known invalid CNPJs
  if (/^(.)\1+$/.test(cnpj)) return false;

  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  const digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += Number(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (result !== Number(digits.charAt(0))) return false;

  length += 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += Number(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  return result === Number(digits.charAt(1));
};

export const formatCPForCNPJ = (input: string): string => {
  const numbers = input.replace(/\D/g, "").substring(0, 14);
  return numbers.length > 11 ? formatCNPJ(numbers) : formatCPF(numbers);
};

export const isValidCPForCNPJ = (input: string): boolean => {
  const numbers = input.replace(/\D/g, "").substring(0, 14);
  return numbers.length > 11 ? isValidCNPJ(numbers) : isValidCPF(numbers);
};
