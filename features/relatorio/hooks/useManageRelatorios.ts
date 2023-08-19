import { useContext, useState } from "react";
import { ProdutorContext } from "@contexts/ProdutorContext";
import { UsuarioAPI } from "@infrastructure/api/UsuarioAPI";
import { RelatorioService } from "@services/RelatorioService";
import { useAuth } from "../../../hooks/useAuth";
import { Relatorio } from "_types/Relatorio";
import { Usuario } from "_types/Usuario";

export const useManageRelatorio = () => {
  const { produtor } = useContext(ProdutorContext);
  const [relatorio, setState] = useState<any>({});
  const { user } = useAuth();

  const handleChange = (name: string, value: any): void => {
    setState((state: any) => ({ ...state, [name]: value }));
  };

  const saveRelatorio = async () => {
    const relatorioInput = {
      ...relatorio,
      produtorId: produtor?.id_pessoa_demeter,
      tecnicoId: user?.id_usuario,
    };
    const relatorioId = await RelatorioService.createRelatorio(relatorioInput);
    return relatorioId;
  };

  const getRelatorios = async (
    produtorId: string | undefined
  ): Promise<Relatorio[]> => {
    if (!produtorId) return [];
    try {
      const relatoriosData = await RelatorioService.getRelatorios(produtorId);
      if (!relatoriosData.length) {
        return relatoriosData;
      }
      const tecnicoIds = [
        ...new Set(
          relatoriosData
            .map((r: Relatorio) => r?.tecnicoId?.toString())
            .filter((id) => !!id)
        ),
      ];
      const tecnicos = (
        await Promise.allSettled(
          tecnicoIds.map((tecnicoId: any) => UsuarioAPI.getUsuario(tecnicoId))
        )
      )
        .filter((result) => result.status === "fulfilled")
        .map((result) => (result.status === "fulfilled" ? result.value : null))
        .filter((tecnico: any) => !!tecnico) as Usuario[];

      const relatorios = relatoriosData.map((r: Relatorio) => {
        const tecnico = tecnicos.find((t) => t?.id_usuario == r?.tecnicoId);
        const nome_tecnico = tecnico?.nome_usuario;
        return { ...r, nome_tecnico };
      });
      return relatorios;
    } catch (error) {
      console.log("🚀useManageRelatorios.ts:60 error:", error);
    }
    return [];
  };

  return {
    relatorio,
    getRelatorios,
    handleChange,
    saveRelatorio,
  };
};
