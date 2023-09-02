import { View, StyleSheet } from "react-native";
import { useCustomNavigation } from "@navigation/hooks";
import { useManageRelatorio } from "../hooks";
import { useSelectProdutor } from "@features/produtor/hooks";
import { ProdutorInfo, ProdutorSearchBar } from "@features/produtor/components";
import { List } from "@shared/components/organisms";
import { CustomDialog } from "@shared/components/organisms";
import { SnackBar } from "@shared/components/molecules";
import { AddButton, ListTitle } from "@shared/components/atoms";
import { globalColors } from "@shared/constants/themes";
import { Relatorio } from "../types/Relatorio";
import { RELATORIO_COLUMNS } from "../constants";
import { useSnackBar } from "@shared/hooks";

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
    getPDFLink,
  } = useManageRelatorio(produtor?.id_pessoa_demeter);
  const { snackBarOptions, setSnackBarOptions, hideSnackBar } = useSnackBar();

  const handleCreateRelatorio = () => {
    navigation.navigate("CreateRelatorioScreen", { relatorios });
  };

  const handleEditRelatorio = (relatorioId: string | number) => {
    navigation.navigate("EditRelatorioScreen", { relatorioId });
  };

  const handleGetPDF = async (relatorioId: string | number) => {
    setSnackBarOptions({
      status: "success",
      message: "Link do PDF copiado para a área de transferências",
    });
    await getPDFLink(relatorioId);
    return;
  };

  if (!produtor) {
    return (
      <View style={styles.container}>
        <ProdutorSearchBar />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <ProdutorInfo />
        {relatorios?.length ? (
          <>
            <ListTitle title={"Relatorios cadastrados"} />
            <List<Relatorio>
              data={formatRelatorioRows(relatorios)}
              columns={RELATORIO_COLUMNS}
              onEdit={handleEditRelatorio}
              getPDFLink={handleGetPDF}
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
        <AddButton
          label="Criar Novo Relatório"
          onPress={handleCreateRelatorio}
        />
      </View>
      <SnackBar {...snackBarOptions} onDismiss={hideSnackBar} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.grayscale[50],
    alignItems: "center",
  },
});
