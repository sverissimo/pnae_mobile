import { useContext, useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";
import { UsuarioAPI } from "@infrastructure/api/UsuarioAPI";
import { ProdutorContext } from "@contexts/ProdutorContext";
import { RelatorioService } from "@services/RelatorioService";
import { useAuth } from "@auth/hooks/useAuth";
import { Relatorio } from "@features/relatorio/types/Relatorio";
import { Usuario } from "@shared/types/Usuario";
import { RelatorioContext } from "@contexts/RelatorioContext";
import { formatDate, truncateString } from "@shared/utils";
import { env } from "config/env";

export const useManageRelatorio = (produtorId?: string) => {
  const { relatorios, setRelatorios } = useContext(RelatorioContext);
  const { produtor } = useContext(ProdutorContext);
  const { user } = useAuth();

  const [relatorio, setState] = useState<Relatorio>({} as Relatorio);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
        produtorId: produtor!.id_pessoa_demeter!,
        tecnicoId: user!.id_usuario,
      };

      const relatorioId = await RelatorioService.createRelatorio(
        relatorioInput
      );

      const relatoriosListUpdated = [
        ...relatorios,
        {
          ...relatorio,
          id: relatorioId,
          nomeTecnico: user?.nome_usuario,
          produtorId: produtor!.id_pessoa_demeter!,
          createdAt: formatDate(new Date().toISOString()),
        },
      ];
      setRelatorios(relatoriosListUpdated);
    } catch (error) {
      console.log("🚀 useManageRelatorios.ts:38 ~ error:", error);
    }
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
        const nomeTecnico = tecnico?.nome_usuario;
        return { ...r, nomeTecnico };
      });
      setRelatorios(relatorios);
      return relatorios;
    } catch (error) {
      console.log("🚀useManageRelatorios.ts:60 error:", error);
    }
    return [];
  };

  const updateRelatorio = async (relatorio: Relatorio) => {
    await RelatorioService.updateRelatorio(relatorio);
    updateRelatoriosList(relatorio);
  };

  const updateRelatoriosList = (relatorio: Relatorio) => {
    const updatedRelatorio: Relatorio = {
      ...relatorio,
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

  const onDelete = async (relatorio: Relatorio) => {
    setState(relatorio);
    setShowDeleteDialog(true);
  };

  const onConfirmDelete = async () => {
    try {
      await RelatorioService.deleteRelatorio(relatorio.id!);
      const updatedList = relatorios.filter((r) => r.id !== relatorio.id);
      setRelatorios(updatedList);
      setState({} as Relatorio);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("🚀 ~ useManageRelatorios.ts ~ line 127", error);
    }
  };

  const getPDFLink = async (relatorioId: any) => {
    try {
      const getPDFUrl = `${env.SERVER_URL}/relatorios/pdf/${relatorioId}`;
      await Clipboard.setStringAsync(getPDFUrl);
      console.log("Copied to Clipboard: ", getPDFUrl);
      return;
    } catch (error) {
      console.log("Clipboard error", error);
    }
  };

  const formatRelatorioRows = (relatorios: Relatorio[]) => {
    const relatorioTableData = relatorios.map((r: Relatorio) => ({
      id: r?.id,
      numeroRelatorio: r?.numeroRelatorio,
      assunto: truncateString(r?.assunto),
      nomeTecnico: r?.nomeTecnico,
      createdAt: formatDate(r?.createdAt),
    }));
    return relatorioTableData;
  };

  return {
    relatorio,
    setRelatorio: setState,
    relatorios,
    showDeleteDialog,
    getRelatorios,
    handleChange,
    saveRelatorio,
    updateRelatorio,
    setShowDeleteDialog,
    onDelete,
    onConfirmDelete,
    formatRelatorioRows,
    getPDFLink,
  };
};
