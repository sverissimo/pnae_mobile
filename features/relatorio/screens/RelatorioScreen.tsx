import { View, StyleSheet } from "react-native";
import { globalColors } from "../../../constants/themes";
import { useCustomNavigation } from "../../../hooks/useCustomNavigation";
import { useManageRelatorio } from "../hooks/useManageRelatorios";
import { useSelectProdutor } from "../../produtor/hooks/useSelectProdutor";
import { ProdutorSearchBar } from "../../produtor/components/ProdutorSearchBar";
import { ProdutorInfo } from "../../produtor/components/ProdutorInfo";
import { AddButton, ListTitle } from "@shared/components/atoms";
import { CustomDialog } from "@shared/components/organisms/CustomDialog";
import { List } from "@shared/components/organisms";
import { Relatorio } from "../types/Relatorio";
import { RELATORIO_COLUMNS } from "../relatorioColumns";

export const RelatorioScreen = () => {
  const { produtor } = useSelectProdutor();
  const { navigation } = useCustomNavigation();
  const {
    relatorio,
    relatorios,
    onDelete,
    showDeleteDialog,
    setShowDeleteDialog,
    formatRelatorioRows,
    onConfirmDelete,
  } = useManageRelatorio(produtor?.id_pessoa_demeter);

  const handleCreateRelatorio = () => {
    navigation.navigate("CreateRelatorioScreen", { relatorios });
  };

  const handleEditRelatorio = (relatorioId: string | number) => {
    navigation.navigate("EditRelatorioScreen", { relatorioId });
  };

  if (!produtor) {
    return (
      <View style={styles.container}>
        <ProdutorSearchBar />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProdutorInfo />
      {relatorios?.length ? (
        <>
          <ListTitle title={"Relatorios cadastrados"} />
          <List<Relatorio>
            data={formatRelatorioRows(relatorios)}
            columns={RELATORIO_COLUMNS}
            onEdit={handleEditRelatorio}
            onDelete={onDelete}
          />
          <CustomDialog
            show={showDeleteDialog}
            setShowDeleteDialog={setShowDeleteDialog}
            deleteDialogMessage="Deseja realmente excluir este relatório?"
            deleteDialogTitle={`Excluir Relatório nº ${relatorio.numeroRelatorio}`}
            onConfirmDelete={onConfirmDelete}
          />
        </>
      ) : (
        <ListTitle title={"Nenhum relatório cadastrado"} />
      )}
      <AddButton label="Criar Novo Relatório" onPress={handleCreateRelatorio} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.grayscale[50],
    alignItems: "center",
  },
});
