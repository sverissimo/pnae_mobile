import { useSelectProdutor } from "../hooks/useSelectProdutor";
import { List } from "../../../@shared/components/organisms/List";
import { PRODUTOR_COLUMNS } from "../produtorColumns";
import { formatDate } from "@shared/utils/formatDate";
import { formatCPF } from "@shared/utils/formatCPF";

export const ProdutorDetails = () => {
  const { produtor } = useSelectProdutor();
  if (!produtor) {
    return null;
  }
  const { nr_cpf_cnpj, dt_nascimento, sn_ativo, dap } = produtor;
  const produtorDetails = [
    {
      id: produtor.id_pessoa_demeter,
      nr_cpf_cnpj: formatCPF(nr_cpf_cnpj),
      dt_nascimento: formatDate(dt_nascimento),
      sn_ativo,
      dap,
    },
  ];
  return (
    <>
      <List data={produtorDetails} columns={PRODUTOR_COLUMNS} />
    </>
  );
};
