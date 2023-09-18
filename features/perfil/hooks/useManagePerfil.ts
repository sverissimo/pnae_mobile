import { useEffect, useState } from "react";
import { Produtor } from "@features/produtor/types/Produtor";
import { Perfil } from "../types";
import { formatDate } from "@shared/utils";

export const useManagePerfil = (produtor: Produtor) => {
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [perfil, setPerfil] = useState<Perfil>({} as Perfil);

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

  return {
    perfis,
    setPerfis,
    perfil,
    setPerfil,
    getPerfilListData,
  };
};
