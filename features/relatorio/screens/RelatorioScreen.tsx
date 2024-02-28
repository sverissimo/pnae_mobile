import { StyleSheet, View } from "react-native";
import { useCustomNavigation } from "@navigation/hooks";
import { useSelectProdutor } from "@features/produtor/hooks";
import { useManageRelatorio } from "../hooks";
import { ProdutorInfo, ProdutorSearchBar } from "@features/produtor/components";
import { AddButton, HelperMessage, ListTitle } from "@shared/components/atoms";
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
    isLoading,
    createdToday,
    dailyLimit,
    showDeleteDialog,
    onDelete,
    setShowDeleteDialog,
    formatRelatorioRows,
    onConfirmDelete,
    sharePDFLink,
  } = useManageRelatorio(produtor?.id_pessoa_demeter);

  const loadingData = isLoading || isLoadingProdutor;

  const noPerfisSaved = !produtor?.perfis?.length;
  const noRelatorios = !relatorios?.length;

  const disableButton =
    isLoading || isLoadingProdutor || noPerfisSaved || noRelatorios;

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
        {loadingData && <Loading />}
      </View>
    );
  }
  if (noPerfisSaved && !loadingData) {
    return (
      <View style={styles.container}>
        <ProdutorInfo />
        <ListTitle title={"Nenhum relatório cadastrado"} />
        <AddButton
          label="Criar Novo Relatório"
          onPress={handleCreateRelatorio}
          disabled={disableButton}
        />
        <HelperMessage message="Antes de criar um novo relatório, é necessário cadastrar um perfil de entrada." />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <ProdutorInfo />
        {!noRelatorios ? (
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
          <>
            {loadingData ? (
              <Loading />
            ) : (
              <ListTitle title={"Nenhum relatório cadastrado"} />
            )}
          </>
        )}
        {!loadingData && (
          <AddButton
            label="Criar Novo Relatório"
            onPress={handleCreateRelatorio}
            disabled={createdToday || dailyLimit}
          />
        )}
        {(createdToday || dailyLimit) && (
          <HelperMessage
            message={
              createdToday
                ? "Não é possível criar mais de um relatório no mesmo dia para o mesmo produtor."
                : "Limite diário de relatórios atingido."
            }
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
