import { useEffect, useState } from "react";
import { Perfil } from "../types/Perfil";
import { useSelectProdutor } from "@features/produtor/hooks";
import { useCustomNavigation } from "@navigation/hooks";
import { formatDate } from "@shared/utils";
import { Produtor } from "@features/produtor/types/Produtor";

export const useManagePerfil = (produtor: Produtor) => {
  const { navigation } = useCustomNavigation();

  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [perfil, setPerfil] = useState<Perfil>({} as Perfil);

  useEffect(() => {
    if (produtor?.perfis) {
      setPerfis(produtor.perfis);
    }
  }, [produtor]);

  const handleCreatePerfil = () => {
    navigation.navigate("CreatePerfilScreen");
  };

  const handleViewPerfil = (perfilId: string) => {
    const perfil = produtor?.perfis!.find((p) => p.id === perfilId);
    navigation.navigate("ViewPerfilScreen", { perfil });
  };

  const handleEditPerfil = (rowData: any) => {
    const perfil = produtor?.perfis!.find((p) => p.id === rowData.id);
    navigation.navigate("EditPerfilScreen", { perfil });
  };

  const getPerfilListData = (perfis: Perfil[]) =>
    perfis.map((p: any) => ({
      id: p.id,
      tipo_perfil: p.tipo_perfil,
      nome_tecnico: p.usuario.nome_usuario,
      data_preenchimento: formatDate(p.data_preenchimento),
      data_atualizacao: formatDate(p.data_atualizacao),
    }));

  return {
    perfis,
    setPerfis,
    perfil,
    setPerfil,
    handleCreatePerfil,
    handleViewPerfil,
    handleEditPerfil,
    getPerfilListData,
  };
};
