import { useSelectProdutor } from "@features/produtor/hooks";
import { useManageContratos } from "@shared/hooks/useManageContratos";
import { useMemo } from "react";
import { useManageRelatorio } from "./useManageRelatorios";
import { RelatorioDomainService } from "@domain/relatorio/services/RelatorioDomainService";

export const useCreateRelatorioHelper = () => {
  const { produtor } = useSelectProdutor();
  const { relatorios, dailyLimit } = useManageRelatorio();
  const { activeContrato } = useManageContratos();

  const createRelatorioHelpers = useMemo(() => {
    const noPerfisSaved = !produtor?.perfis?.length;
    const noPerfisForThisContract = !produtor?.perfis?.some(
      (perfil) => perfil.id_contrato === activeContrato?.id_contrato
    );
    const noRelatorios = !relatorios?.length;
    const createdToday =
      RelatorioDomainService.checkForCreatedToday(relatorios);

    const disableSaveButton =
      noPerfisSaved || noPerfisForThisContract || createdToday || dailyLimit;

    // console.log({
    //   noPerfisSaved,
    //   noPerfisForThisContract,
    //   createdToday,
    //   dailyLimit,
    //   disableSaveButton,
    // });
    return {
      noPerfisSaved,
      noPerfisForThisContract,
      noRelatorios,
      createdToday,
      disableSaveButton,
    };
  }, [produtor?.perfis, relatorios, activeContrato]);

  const helperMessage = useMemo(() => {
    const { noPerfisSaved, noPerfisForThisContract, createdToday } =
      createRelatorioHelpers;

    if (noPerfisSaved) {
      return "Antes de criar um novo relatório, é necessário cadastrar um perfil de entrada.";
    }
    if (noPerfisForThisContract) {
      return "Antes de criar um novo relatório, é necessário cadastrar um perfil de entrada para este contrato.";
    }
    if (createdToday) {
      return "Não é possível criar mais de um relatório no mesmo dia para o mesmo produtor.";
    }
    if (dailyLimit) {
      return "Limite diário de relatórios atingido.";
    }
    return null;
  }, [createRelatorioHelpers, dailyLimit]);

  return {
    ...createRelatorioHelpers,
    helperMessage,
  };
};
