import { useSelectProdutor } from "../../produtor/hooks/useSelectProdutor";
import { List } from "../../../@shared/components/organisms/List";
import { PROPRIEDADE_COLUMNS } from "../propriedadeColumns";
import { formatCoordinates } from "../../../@shared/utils/formatCoordinates";
import { PropriedadeModel } from "@domain/propriedade/PropriedadeModel";

export const PropriedadesList = () => {
  const { produtor } = useSelectProdutor();
  const propriedades = produtor?.propriedades || [];
  const propriedadeData = propriedades.map((p: PropriedadeModel) => ({
    ...p,
    id: p?.id_pl_propriedade,
    geo_ponto_texto: formatCoordinates(p?.geo_ponto_texto),
  }));

  return <List data={propriedadeData} columns={PROPRIEDADE_COLUMNS} />;
};
