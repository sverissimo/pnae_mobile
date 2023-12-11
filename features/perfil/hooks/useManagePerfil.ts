import { useEffect, useState } from "react";
import { Perfil } from "../types";
import { formatDate } from "@shared/utils";
import { ProdutorModel } from "@domain/produtor/ProdutorModel";
import { PerfilService } from "@services/perfil/PerfilService";
import { useManageConnection } from "@shared/hooks";

export const useManagePerfil = (produtor: ProdutorModel | null) => {
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [perfil, setPerfil] = useState<Perfil>({} as Perfil);
  const { isConnected } = useManageConnection();

  useEffect(() => {
    if (produtor?.perfis) {
      setPerfis(produtor.perfis);
    }
  }, [produtor]);

  const getPerfilListData = (perfis: Perfil[]) =>
    perfis.map((p: any) => ({
      id: p.id,
      tipo_perfil: p.tipo_perfil,
      nome_tecnico: p.usuario.nome_usuario,
      data_preenchimento: formatDate(p.data_preenchimento),
      data_atualizacao: formatDate(p.data_atualizacao),
    }));

  const getPerfilOptions = () => {
    const perfilOptions = new PerfilService({
      isConnected: !!isConnected,
    }).getPerfilOptions();
    return perfilOptions;
  };

  return {
    perfis,
    setPerfis,
    perfil,
    setPerfil,
    getPerfilListData,
  };
};
