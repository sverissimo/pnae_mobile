import { formatDate } from "../../../@shared/utils/formatDate";
import { List } from "../../../@shared/components/organisms/List";
import { Relatorio } from "../../../types/Relatorio";
import { RELATORIO_COLUMNS } from "../relatorioColumns";
import { truncateString } from "../../../@shared/utils/truncateString";

interface RelatoriosListProps {
  relatorios?: Relatorio[];
}

export const RelatorioList = ({ relatorios }: RelatoriosListProps) => {
  if (!relatorios) return null;

  const relatorioData = relatorios.map((r: Relatorio) => ({
    id: r?.id,
    numeroRelatorio: r?.numeroRelatorio,
    assunto: truncateString(r?.assunto),
    nome_tecnico: r?.nome_tecnico,
    createdAt: formatDate(r?.createdAt),
  }));

  return (
    <>
      <List data={relatorioData} columns={RELATORIO_COLUMNS} />
    </>
  );
};
