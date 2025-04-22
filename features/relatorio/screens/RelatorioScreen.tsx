import { StyleSheet, View } from "react-native";
import { useCustomNavigation } from "@navigation/hooks";
import { useSelectProdutor } from "@features/produtor/hooks";
import { useManageRelatorio } from "../hooks";
import { useCreateRelatorioHelper } from "../hooks/useCreateRelatorioHelper";
import { RelatorioModel } from "../types";
import { ProdutorInfo, ProdutorSearchBar } from "@features/produtor/components";
import { CustomDialog, List, Loading } from "@shared/components/organisms";
import { AddButton, HelperMessage, ListTitle } from "@shared/components/atoms";
import { globalColors } from "@shared/constants/themes";
import { RELATORIO_COLUMNS } from "../constants";

export const RelatorioScreen = () => {
  const { produtor, isLoading: isLoadingProdutor } = useSelectProdutor();
  const { navigation } = useCustomNavigation();
  const {
    relatorio,
    relatorios,
    showDeleteDialog,
    isLoading: isLoadingRelatorios,
    onDelete,
    setShowDeleteDialog,
    formatRelatorioRows,
    onConfirmDelete,
    sharePDFLink,
  } = useManageRelatorio();

  const isLoading = isLoadingProdutor || isLoadingRelatorios;
  const { noRelatorios, disableSaveButton, helperMessage } =
    useCreateRelatorioHelper();

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
        {isLoading && <Loading />}
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <ProdutorInfo />
        {isLoading && <Loading />}
        {!isLoading && noRelatorios && (
          <ListTitle title={"Nenhum relatório cadastrado"} />
        )}

        {!isLoading && !noRelatorios && (
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
        )}

        <>
          {!isLoading && helperMessage && (
            <HelperMessage message={helperMessage} />
          )}
          {!isLoading && (
            <AddButton
              label="Criar Novo Relatório"
              onPress={handleCreateRelatorio}
              disabled={isLoading || disableSaveButton}
            />
          )}
        </>
      </View>
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
