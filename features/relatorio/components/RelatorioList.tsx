import { useSelectProdutor } from "../../produtor/hooks/useSelectProdutor";
import { formatDate } from "../../../@shared/utils/formatDate";
import { List } from "../../../components/organisms/List";
import { Relatorio } from "../../../types/Relatorio";
import { RELATORIO_COLUMNS } from "../relatorioColumns";
import { truncateString } from "../../../@shared/utils/truncateString";

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

  return (
    <>
      <List data={relatorioData} columns={RELATORIO_COLUMNS} />
    </>
  );
};
