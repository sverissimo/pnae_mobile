import { Text, View, StyleSheet } from "react-native";
import { useSelectProdutor } from "../../produtor/hooks/useSelectProdutor";
import { formatDate } from "../../../utils/formatDate";
import { List } from "../../../components/List";
import { Relatorio } from "../types/Relatorio";
import { RELATORIO_COLUMNS } from "../relatorioColumns";
import { truncateString } from "../../../utils/truncateString";

export const RelatorioList = () => {
  const { produtor } = useSelectProdutor();
  if (!produtor?.relatorios) return null;

  const relatorioData = produtor.relatorios.map((r: Relatorio) => ({
    id: r?.id,
    numeroRelatorio: r?.numeroRelatorio,
    assunto: truncateString(r?.assunto),
    nome_tecnico: "TBE",
    createdAt: formatDate(r?.createdAt),
  }));

  //return <Text>Hi</Text>;

  return (
    <List
      title="Relatorios cadastrados"
      data={relatorioData}
      columns={RELATORIO_COLUMNS}
    />
  );
};
