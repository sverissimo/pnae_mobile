import { useContext, useEffect, useState } from "react";
import { ProdutorContext } from "@contexts/ProdutorContext";
import { UsuarioAPI } from "@infrastructure/api/UsuarioAPI";
import { RelatorioService } from "@services/RelatorioService";
import { useAuth } from "../../../hooks/useAuth";
import { Relatorio } from "features/relatorio/types/Relatorio";
import { Usuario } from "_types/Usuario";
import { RelatorioContext } from "@contexts/RelatorioContext";

export const useManageRelatorio = (produtorId?: string) => {
  const { produtor } = useContext(ProdutorContext);
  const { relatorios, setRelatorios } = useContext(RelatorioContext);
  const [relatorio, setState] = useState<Relatorio>({});
  const { user } = useAuth();

  useEffect(() => {
    if (produtorId) {
      getRelatorios(produtorId);
    }
  }, [produtorId]);

  const handleChange = (name: string, value: any): void => {
    setState((state: any) => ({ ...state, [name]: value }));
  };

  const saveRelatorio = async (relatorio: Relatorio) => {
    try {
      const relatorioInput = {
        ...relatorio,
        produtorId: produtor?.id_pessoa_demeter,
        tecnicoId: user?.id_usuario,
      };
      //|TODO: IMPLEMENT THIS CALL AND UPDATE TO BACKEND, GET RID OF useManageRelatorios "relatorio" state
      //await RelatorioService.createRelatorio(relatorioInput);
      updateRelatorio({ relatorio });
    } catch (error) {
      console.log(
        "🚀 ~ file: useManageRelatorios.ts:38 ~ saveRelatorio ~ error:",
        error
      );
    }
  };

  const updateRelatorio = async ({
    relatorio,
    sync = false,
  }: {
    relatorio: Relatorio;
    sync?: boolean;
  }) => {
    if (sync) {
      await RelatorioService.updateRelatorio(relatorio);
    }
    const updatedRelatorio: Relatorio = {
      ...relatorio,
      produtor,
      nomeTecnico: user?.nome_usuario,
    };

    if (relatorio.id) {
      const updatedList = [...relatorios];
      const updateIndex = updatedList.findIndex((r) => r.id === relatorio.id);
      updatedList.splice(updateIndex, 1, updatedRelatorio);
      setRelatorios(updatedList);
      return;
    }

    setRelatorios((relatorios: Relatorio[]) => [
      ...relatorios,
      updatedRelatorio,
    ]);
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
      setRelatorios(relatorios);
      return relatorios;
    } catch (error) {
      console.log("🚀useManageRelatorios.ts:60 error:", error);
    }
    return [];
  };

  return {
    relatorio,
    relatorios,
    getRelatorios,
    handleChange,
    saveRelatorio,
  };
};
