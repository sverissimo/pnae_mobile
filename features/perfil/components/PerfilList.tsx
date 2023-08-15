import { useSelectProdutor } from "../../produtor/hooks/useSelectProdutor";
import { formatDate } from "../../../@shared/utils/formatDate";
import { List } from "../../../components/organisms/List";
import { PERFIL_COLUMNS } from "../forms/perfilColumns";
import { useCustomNavigation } from "../../../hooks/useCustomNavigation";

const PerfilList = () => {
  const { produtor } = useSelectProdutor();
  const { navigation } = useCustomNavigation();
  if (!produtor?.perfis) return null;
  const handlePress = (rowData: any) => {
    const perfil = produtor.perfis!.find((p) => p.id === rowData.id);

    navigation.navigate("EditPerfilScreen", { perfil });
  };

  const perfilData = produtor.perfis.map((p: any) => ({
    id: p.id,
    tipo_perfil: p.tipo_perfil,
    nome_tecnico: p.usuario.nome_usuario,
    data_preenchimento: formatDate(p.data_preenchimento),
    data_atualizacao: formatDate(p.data_atualizacao),
  }));

  if (!produtor?.perfis) return null;

  return (
    <List data={perfilData} columns={PERFIL_COLUMNS} onPress={handlePress} />
  );
};

export default PerfilList;
