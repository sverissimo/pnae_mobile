import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { RelatorioService } from "@services/RelatorioService";
import { Relatorio } from "_types/Relatorio";
import { UsuarioAPI } from "@infrastructure/api/UsuarioAPI";
import { Usuario } from "_types/Usuario";

export const useManageRelatorio = (produtorId: string = "") => {
  const [relatorio, setState] = useState<any>({});
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (produtorId) {
      getRelatorios(produtorId);
    }
  }, [produtorId]);

  const handleChange = (name: string, value: any) => {
    setState((state: any) => ({ ...state, [name]: value }));
  };

  const setRelatorio = async () => {
    const relatorioInput = {
      ...relatorio,
      produtorId,
      tecnicoId: user?.id_usuario,
    };
    const result = await RelatorioService.createRelatorio(relatorioInput);
    return result;
  };

  const getRelatorios = async (produtorId: string) => {
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
    } catch (error) {
      console.log("🚀useManageRelatorios.ts:60 error:", error);
    }
  };

  return { relatorio, relatorios, handleChange, setRelatorio };
};
