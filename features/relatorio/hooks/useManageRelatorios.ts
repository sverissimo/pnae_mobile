import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useSelectProdutor } from "../../produtor/hooks/useSelectProdutor";
import { RelatorioService } from "@services/RelatorioService_rn";

export const useManageRelatorio = () => {
  const [relatorio, setState] = useState<any>({});
  const { user } = useAuth();
  const { produtor } = useSelectProdutor();

  const handleChange = (name: string, value: any) => {
    setState((state: any) => ({ ...state, [name]: value }));
  };

  const setRelatorio = async () => {
    const relatorioInput = {
      ...relatorio,
      tecnicoId: user?.id_usuario,
      produtorId: produtor?.id_pessoa_demeter,
    };

    const result = await RelatorioService.createRelatorio(relatorioInput);
    console.log(
      "🚀 ~ file: useManageRelatorios.ts:22 ~ setRelatorio ~ result:",
      result
    );
  };

  return { relatorio, handleChange, setRelatorio };
};
