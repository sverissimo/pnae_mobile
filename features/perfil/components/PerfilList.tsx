import { useManagePerfil } from "../hooks/useManagePerfil";
import { List } from "../../../@shared/components/organisms/List";
import { PERFIL_COLUMNS } from "../constants";
import { PerfilModel } from "@domain/perfil";

const PerfilList = ({ data, handleViewPerfil, handleEditPerfil }: any) => {
  const columnsWithoutOpts = PERFIL_COLUMNS.filter(
    (column) => column.key !== "options"
  );

  const { getPerfilListData } = useManagePerfil(data);
  return (
    <List<PerfilModel>
      data={getPerfilListData(data)}
      columns={!!handleViewPerfil ? PERFIL_COLUMNS : columnsWithoutOpts}
      onView={handleViewPerfil}
      onEdit={handleEditPerfil}
    />
  );
};

export default PerfilList;
