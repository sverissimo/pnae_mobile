import { StyleSheet, View } from "react-native";

import { ProdutorInfo, ProdutorSearchBar } from "@features/produtor/components";
import { useSelectProdutor } from "@features/produtor/hooks";
import { useCustomNavigation } from "@navigation/hooks";
import { AddButton, ListTitle } from "@shared/components/atoms";
import { SnackBar } from "@shared/components/molecules";
import { CustomDialog, List } from "@shared/components/organisms";
import { globalColors } from "@shared/constants/themes";
import { useSnackBar } from "@shared/hooks";

import { RELATORIO_COLUMNS } from "../constants";
import { useManageRelatorio } from "../hooks";
import { RelatorioModel } from "../types";
import { env } from "config";

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
    sharePDFLink,
  } = useManageRelatorio(produtor?.id_pessoa_demeter);

  const { snackBarOptions, setSnackBarOptions, hideSnackBar } = useSnackBar();

  const handleCreateRelatorio = () => {
    navigation.navigate("CreateRelatorioScreen", { relatorios });
  };

  const handleViewRelatorio = (relatorioId: string | number) => {
    navigation.navigate("ViewRelatorioScreen", { relatorioId });
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
    <>
      <View style={styles.container}>
        <ProdutorInfo />
        {relatorios?.length ? (
          <>
            <ListTitle title={"Relatorios cadastrados"} />
            <List<RelatorioModel>
              data={formatRelatorioRows(relatorios)}
              columns={RELATORIO_COLUMNS}
              onView={handleViewRelatorio}
              onEdit={handleEditRelatorio}
              getPDFLink={sharePDFLink}
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
