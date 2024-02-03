import { StyleSheet, View } from "react-native";
import { useCustomNavigation } from "@navigation/hooks";
import { useSelectProdutor } from "@features/produtor/hooks";
import { useManageRelatorio } from "../hooks";
import { ProdutorInfo, ProdutorSearchBar } from "@features/produtor/components";
import { AddButton, ListTitle } from "@shared/components/atoms";
import { CustomDialog, List, Loading } from "@shared/components/organisms";
import { RelatorioModel } from "../types";
import { globalColors } from "@shared/constants/themes";
import { RELATORIO_COLUMNS } from "../constants";

export const RelatorioScreen = () => {
  const { produtor, isLoading: isLoadingProdutor } = useSelectProdutor();

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
    isLoading,
  } = useManageRelatorio(produtor?.id_pessoa_demeter);

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
        {(isLoading || isLoadingProdutor) && <Loading />}
      </View>
    );
  }
  if (!produtor?.perfis?.length) {
    return (
      <View style={styles.container}>
        <ProdutorInfo />
        <ListTitle
          title={
            "Antes de criar um novo relatório, é necessário cadastrar um perfil de entrada."
          }
        />
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
          relatorios?.length === 0 &&
          !isLoading &&
          !isLoadingProdutor && (
            <ListTitle title={"Nenhum relatório cadastrado"} />
          )
        )}
        {(isLoading || isLoadingProdutor) && <Loading />}
        {!isLoading && !isLoadingProdutor && (
          <AddButton
            label="Criar Novo Relatório"
            onPress={handleCreateRelatorio}
          />
        )}
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
