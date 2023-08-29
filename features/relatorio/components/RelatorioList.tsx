import { formatDate } from "../../../@shared/utils/formatDate";
import { List } from "../../../@shared/components/organisms/List";
import { Relatorio } from "../types/Relatorio";
import { RELATORIO_COLUMNS } from "../relatorioColumns";
import { truncateString } from "../../../@shared/utils/truncateString";

interface RelatoriosListProps {
  relatorios?: Relatorio[];
  onEdit?: (relatorioId: string | number) => void;
}

export const RelatorioList = ({ relatorios, onEdit }: RelatoriosListProps) => {
  if (!relatorios) return null;

  const relatorioData = relatorios.map((r: Relatorio) => ({
    id: r?.id,
    numeroRelatorio: r?.numeroRelatorio,
    assunto: truncateString(r?.assunto),
    nomeTecnico: r?.nomeTecnico,
    createdAt: formatDate(r?.createdAt),
  }));

  return (
    <List data={relatorioData} columns={RELATORIO_COLUMNS} onEdit={onEdit} />
  );
};
