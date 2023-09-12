import { useSelectProdutor } from "../../produtor/hooks/useSelectProdutor";
import { formatDate } from "../../../@shared/utils/formatDate";
import { List } from "../../../@shared/components/organisms/List";

import { useCustomNavigation } from "../../../navigation/hooks/useCustomNavigation";
import { PERFIL_COLUMNS } from "../constants";
import { Perfil } from "../types/Perfil";
import { useManagePerfil } from "../hooks/useManagePerfil";

const PerfilList = ({ data, handleViewPerfil, handleEditPerfil }: any) => {
  const { getPerfilListData } = useManagePerfil();
  return (
    <List<Perfil>
      data={getPerfilListData(data)}
      columns={PERFIL_COLUMNS}
      onView={handleViewPerfil}
      onEdit={handleEditPerfil}
    />
  );
};

export default PerfilList;
