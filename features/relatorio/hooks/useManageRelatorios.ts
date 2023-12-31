import { useContext, useEffect, useState } from "react";
import { Share } from "react-native";
import { env } from "@config/env";
import { RelatorioService } from "@services/relatorio/RelatorioService";
import { AtendimentoService } from "@services/atendimento/AtendimentoService";
import { ProdutorContext } from "@contexts/ProdutorContext";
import { RelatorioContext } from "@contexts/RelatorioContext";
import { useAuth } from "@auth/hooks/useAuth";
import { useLocation, useManageConnection } from "@shared/hooks";
import { useManageTecnico } from "@features/tecnico/hooks";
import { RelatorioModel } from "@features/relatorio/types";
import { formatDate, truncateString } from "@shared/utils";
import createRelatorioInput from "_mockData/createRelatorioInput.json";

export const useManageRelatorio = (produtorId?: string) => {
  const { produtor } = useContext(ProdutorContext);
  const { relatorios, setRelatorios } = useContext(RelatorioContext);
  const { getLocation } = useLocation();
  const { isConnected, connectionType } = useManageConnection();
  const { user } = useAuth();

  const [relatorio, setState] = useState<RelatorioModel>({} as RelatorioModel);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [enableSave, setEnableSave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { extensionistas } = useManageTecnico(relatorio);

  useEffect(() => {
    if (produtorId) {
      (async () => await getRelatorios(produtorId))();
    }
  }, [produtorId]);

  useEffect(() => {
    const nomeOutroExtensionista = extensionistas
      .map((e) => e?.nome_usuario)
      .join(",");
    setState((state: any) => ({
      ...state,
      nomeOutroExtensionista,
      outroExtensionista: extensionistas,
    }));
  }, [extensionistas]);

  useEffect(() => {
    const validInput = Object.entries(relatorio).every(([key, value]) => {
      const requiredFields = ["assunto", "numeroRelatorio", "orientacao"];
      if (requiredFields.includes(key)) {
        return !!value;
      }
      return true;
    });
    setEnableSave(validInput);
  }, [relatorio]);

  const handleChange = (name: string, value: any): void => {
    setState((state: any) => ({ ...state, [name]: value }));
  };

  const saveRelatorio = async (relatorio: RelatorioModel) => {
    try {
      const coordenadas = getLocation();
      const relatorioInput = {
        ...relatorio,
        produtorId: produtor!.id_pessoa_demeter!,
        tecnicoId: user!.id_usuario,
        outroExtensionista: extensionistas,
        coordenadas,
      };

      const connected = !!(isConnected && connectionType !== "unknown");

      //********************FAKE INPUT FOR TESTING !!!!!!!!!!!!!!!!! */
      // const { pictureURI, assinaturaURI, ...input } = createRelatorioInput;
      // Object.assign(relatorioInput, input); // Testing ONLY!!!
      //************************ */

      console.log(
        "🚀 - file: useManageRelatorios.ts:82 - saveRelatorio - relatorioInput:",
        relatorioInput
      );

      const relatorioId = await new RelatorioService({
        isConnected: !!connected,
      }).createRelatorio(relatorioInput);

      // *** Cria o atendimento offline ou remoto (caso online)
      const propriedade = produtor!.propriedades![0];
      const atendimento = {
        id_usuario: user!.id_usuario,
        id_pessoa_demeter: produtor!.id_pessoa_demeter,
        id_pl_propriedade: propriedade.id_pl_propriedade,
        id_und_empresa: propriedade.id_und_empresa,
        id_relatorio: relatorioId,
      };

      await new AtendimentoService({ isConnected: connected }).create(
        atendimento
      );

      setRelatorios([
        ...relatorios,
        {
          ...relatorioInput,
          id: relatorioId,
          nomeTecnico: user?.nome_usuario || "",
          produtorId: produtor!.id_pessoa_demeter!,
          createdAt: formatDate(new Date().toISOString()),
        },
      ]);
    } catch (error) {
      console.log("🚀 useManageRelatorios.ts:38 ~ error:", error);
      throw error;
    }
  };

  const getRelatorios = async (
    produtorId: string | undefined
  ): Promise<RelatorioModel[]> => {
    if (!produtorId) {
      return [];
    }
    try {
      setIsLoading(true);
      const connected = !!(isConnected && connectionType !== "unknown");
      const relatorios = await new RelatorioService({
        isConnected: connected,
      }).getRelatorios(produtorId);
      if (!relatorios.length) {
        setIsLoading(false);
        return [];
      }

      setRelatorios(relatorios);
      setIsLoading(false);
      return relatorios;
    } catch (error) {
      console.error("🚀useManageRelatorios.ts:60 error:", error);
    }
    return [];
  };

  const updateRelatorio = async (relatorio: RelatorioModel) => {
    try {
      const relatorioUpdate = {
        ...relatorio,
        produtorId: produtor!.id_pessoa_demeter!,
        tecnicoId: user!.id_usuario,
      };

      const connected = !!(isConnected && connectionType !== "unknown");
      await new RelatorioService({ isConnected: connected }).updateRelatorio(
        relatorioUpdate
      );
      updateRelatoriosList(relatorioUpdate);
    } catch (error) {
      console.log("🚀 ~ file: useManageRelatorios.ts:118:", error);
      throw error;
    }
  };

  const updateRelatoriosList = (relatorio: RelatorioModel) => {
    const updatedRelatorio: RelatorioModel = {
      ...relatorio,
      nomeTecnico: user?.nome_usuario || "",
    };
    if (relatorio.id) {
      const updatedList = [...relatorios];
      const updateIndex = updatedList.findIndex((r) => r.id === relatorio.id);
      updatedList.splice(updateIndex, 1, updatedRelatorio);
      setRelatorios(updatedList);
      return;
    }

    setRelatorios((relatorios: RelatorioModel[]) => [
      ...relatorios,
      updatedRelatorio,
    ]);
  };

  const onDelete = async (relatorio: RelatorioModel) => {
    setState(relatorio);
    setShowDeleteDialog(true);
  };

  const onConfirmDelete = async () => {
    try {
      const connected = !!(isConnected && connectionType !== "unknown");
      await new RelatorioService({ isConnected: connected }).deleteRelatorio(
        relatorio.id!
      );

      const updatedList = relatorios.filter((r) => r.id !== relatorio.id);
      setRelatorios(updatedList);
      setState({} as RelatorioModel);
      setShowDeleteDialog(false);
    } catch (error) {
      console.log("🚀 ~ useManageRelatorios.ts ~ line 127", error);
    }
  };

  const formatRelatorioRows = (relatorios: RelatorioModel[]) => {
    const preventDelete = (r: RelatorioModel) =>
      !isConnected || r.nomeTecnico !== user?.nome_usuario;

    const relatorioTableData = relatorios.map((r: RelatorioModel) => ({
      id: r?.id,
      numeroRelatorio: r?.numeroRelatorio,
      assunto: truncateString(r?.assunto),
      nomeTecnico: r?.nomeTecnico,
      createdAt: formatDate(r?.createdAt),
      readOnly: r?.readOnly,
      preventDelete: preventDelete(r),
    }));
    return relatorioTableData;
  };

  const sharePDFLink = async (relatorioId: string | number) => {
    const { numeroRelatorio } = relatorios.find(
      (relatorio) => relatorio.id === relatorioId
    )!;
    const nomeProdutor = produtor?.nm_pessoa;
    const url = `${env.SERVER_URL}/relatorios/pdf/${relatorioId}`;
    try {
      const result = await Share.share(
        {
          title: `Relatório nº${numeroRelatorio} - PNAE Mobile APP`,
          url: "../../../assets/images/logo.png",
          message: `Link para o PDF \nProdutor ${nomeProdutor} \nRelatório nº${numeroRelatorio}
          \n${url}`,
        },
        { dialogTitle: "Compartilhar Relatório" }
      );
      if (result.action === Share.sharedAction) {
        console.info("🚀 useManageRelatorios.ts:185 ~ sharePDFLink:", result);
      }
    } catch (error: any) {
      console.error("🚀 RelatorioScreen.tsx:49:", error);
    }
  };

  return {
    relatorio,
    relatorios,
    showDeleteDialog,
    enableSave,
    isLoading,
    setRelatorio: setState,
    getRelatorios,
    handleChange,
    saveRelatorio,
    updateRelatorio,
    setShowDeleteDialog,
    onDelete,
    onConfirmDelete,
    formatRelatorioRows,
    sharePDFLink,
    setEnableSave,
  };
};
