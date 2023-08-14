import { useSelectProdutor } from "../../produtor/hooks/useSelectProdutor";
import { formatDate } from "../../../utils/formatDate";
import { List } from "../../../components/List";
import { PERFIL_COLUMNS } from "../forms/perfilColumns";

const PerfilList = () => {
  const { produtor } = useSelectProdutor();
  if (!produtor?.perfis) return null;

  const perfilData = produtor.perfis.map((p: any) => ({
    //id: p.id,
    tipo_perfil: p.tipo_perfil,
    nome_tecnico: p.usuario.nome_usuario,
    data_preenchimento: formatDate(p.data_preenchimento),
    data_atualizacao: formatDate(p.data_atualizacao),
  }));

  if (!produtor?.perfis) return null;

  return (
    <List
      title="Perfis cadastrados"
      data={perfilData}
      columns={PERFIL_COLUMNS}
    />
  );
};

export default PerfilList;
