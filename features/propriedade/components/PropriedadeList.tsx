import { Text, View, StyleSheet } from "react-native";
import { useSelectProdutor } from "../../produtor/hooks/useSelectProdutor";
import { formatDate } from "../../../@shared/utils/formatDate";
import { List } from "../../../@shared/components/organisms/List";
import { Propriedade } from "../types/Propriedade";
import { PROPRIEDADE_COLUMNS } from "../propriedadeColumns";
import { formatCoordinates } from "../../../@shared/utils/formatCoordinates";

export const PropriedadesList = () => {
  const { produtor } = useSelectProdutor();
  if (!produtor?.propriedades) return null;

  const propriedadeData = produtor.propriedades.map((p: Propriedade) => ({
    id: p?.id_pl_propriedade,
    nome_propriedade: p?.nome_propriedade,
    area_total: p?.area_total,
    atividade: p?.atividade || p?.atividade_principal,
    geo_ponto_texto: formatCoordinates(p?.geo_ponto_texto),
    id_municipio: p?.id_municipio,
    //produtor: p?.produtor,
    //createdAt: formatDate(r?.createdAt),
  }));

  return <List data={propriedadeData} columns={PROPRIEDADE_COLUMNS} />;
};
