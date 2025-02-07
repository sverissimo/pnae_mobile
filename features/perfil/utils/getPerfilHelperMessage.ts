interface IPerfilHelperMessage {
  produtorHasNoPropriedades: boolean;
  canAddEntrada: boolean;
  canAddSaida: boolean;
  roomForPerfil: boolean;
  relatoriosCount: number;
  isContractExpired: boolean;
}

export const getPerfilHelperMessage = ({
  produtorHasNoPropriedades,
  isContractExpired,
  canAddEntrada,
  canAddSaida,
  roomForPerfil,
  relatoriosCount,
}: IPerfilHelperMessage): string => {
  console.log("🚀 ***********************- :", {
    produtorHasNoPropriedades,
    isContractExpired,
    canAddEntrada,
    canAddSaida,
    roomForPerfil,
    relatoriosCount,
  });

  if (produtorHasNoPropriedades) {
    return "Não é possível criar um novo perfil para um produtor sem propriedades cadastradas no Demeter.";
  }

  if (isContractExpired) {
    return "Não é possível criar um novo perfil para um contrato encerrado.";
  }

  if (!roomForPerfil) {
    return "Não é possível criar um novo perfil para o contrato vigente.";
  }

  if (canAddSaida && relatoriosCount < 4) {
    return "Não é possível criar um perfil de saída. É necessário ter no mínimo 4 relatórios cadastrados para o contrato vigente.";
  }

  if (canAddEntrada || canAddSaida) {
    return "";
  }

  return "Não é possível criar um perfil para esse contrato.";
};
