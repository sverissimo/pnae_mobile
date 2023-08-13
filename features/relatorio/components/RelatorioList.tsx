import { Text, View, StyleSheet } from "react-native";
import { useSelectProdutor } from "../../produtor/hooks/useSelectProdutor";
import { formatDate } from "../../../utils/formatDate";
import { List } from "../../../components/List";
import { Relatorio } from "../types/Relatorio";
import { RELATORIO_COLUMNS } from "../relatorioColumns";

export const RelatoriosList = () => {
  const { produtor } = useSelectProdutor();
  if (!produtor?.relatorios) return null;
  console.log(
    "🚀 ~ file: RelatorioList.tsx:9 ~ RelatoriosList ~ produtor?.relatorios:",
    produtor?.relatorios
  );

  const relatorioData = produtor.relatorios.map((r: Relatorio) => ({
    //id: r?.id,
    numeroRelatorio: r?.numeroRelatorio,
    assunto: r?.assunto,
    nome_tecnico: "TBE",
    createdAt: formatDate(r?.createdAt),
  }));

  //return <Text>Hi</Text>;

  return (
    <List
      title="Relatorios cadastrados:"
      data={relatorioData}
      columns={RELATORIO_COLUMNS}
    />
  );
};
