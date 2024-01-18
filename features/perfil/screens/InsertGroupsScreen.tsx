import { useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useManageGrupos } from "../hooks/useManageGrupos";
import { useCustomNavigation } from "@navigation/hooks";
import { ProdutosDetailsInput } from "../components/ProdutosDetailsInput";
import { Button } from "react-native-paper";
import { SelectDropdown } from "@shared/components/organisms";
import { globalColors } from "@constants/themes";
import { GrupoDetailsInput } from "../components/GrupoDetailsInput";
import { Icon } from "@shared/components/atoms";

export const InsertGroupsScreen = ({ route }: any) => {
  const { navigation } = useCustomNavigation();
  const { item, selectedItems } = route.params;

  const { field } = item;
  const {
    selectedGrupos,
    availableGrupos,
    enableAddGrupo,
    handleSelectGrupo,
    handleSelectProduto,
    handleChange,
    addGrupo,
    filterAddProdutoOptions,
    removeProduto,
  } = useManageGrupos(field, selectedItems);

  useEffect(() => {
    navigation.setOptions({
      title: item.label,
      headerLeft: () => (
        <View style={{ marginRight: 30 }}>
          <Icon iconName="arrow-back" size={26} onPress={handleBackPress} />
        </View>
      ),
    });
  }, [navigation, selectedGrupos]);

  const handleBackPress = () => {
    navigation.navigate("CreatePerfilScreen", {
      key: item.field,
      selectedItems: selectedGrupos.filter(
        (g) =>
          !!g.nm_grupo &&
          g.at_prf_see_produto.length > 0 &&
          Object.keys(g.at_prf_see_produto[0]).length > 1
      ),
    });
  };

  return (
    <ScrollView>
      <Text style={styles.header}>
        {field === "gruposNaturaOptions"
          ? "Grupos de Produtos in Natura"
          : "Grupos de Produtos Industriais"}
      </Text>
      {selectedGrupos.map((grupo, groupIndex) => (
        <View key={groupIndex} style={styles.groupContainer}>
          {grupo?.nm_grupo && grupo?.at_prf_see_produto?.length > 1 ? (
            <View key={groupIndex + 50} style={styles.titleContainer}>
              <Text style={styles.title}>{grupo.nm_grupo}</Text>
            </View>
          ) : (
            (availableGrupos.length && (
              <SelectDropdown
                key={groupIndex + 100}
                label="Adicionar grupo"
                options={availableGrupos}
                onSelect={(group: string) => handleSelectGrupo(group)}
              />
            )) ||
            null
          )}
          {grupo?.nm_grupo &&
          grupo.dados_producao_estratificados_por_produto ? (
            grupo.at_prf_see_produto.map((produto, productIndex) =>
              !produto.nm_produto &&
              filterAddProdutoOptions(grupo).length > 0 ? (
                <SelectDropdown
                  key={productIndex + 441}
                  label="Adicionar produto"
                  options={filterAddProdutoOptions(grupo)}
                  onSelect={(p: string) => handleSelectProduto(p, grupo)}
                />
              ) : (
                produto.id_produto && (
                  <ProdutosDetailsInput
                    key={produto.nm_produto + produto.id_produto}
                    groupIndex={groupIndex}
                    productIndex={productIndex}
                    selectedProduto={produto}
                    onValueChange={handleChange}
                    removeProduto={() => removeProduto(produto)}
                  />
                )
              )
            )
          ) : (
            <>
              {grupo?.nm_grupo &&
                grupo?.at_prf_see_produto?.length > 0 &&
                grupo?.at_prf_see_produto?.[0]?.nm_produto && (
                  <GrupoDetailsInput
                    selectedGrupo={grupo}
                    selectedProdutos={grupo.at_prf_see_produto || []}
                    groupIndex={groupIndex}
                    onValueChange={handleChange}
                    removeProduto={removeProduto}
                  />
                )}
              {grupo?.nm_grupo &&
                filterAddProdutoOptions(grupo).length > 0 &&
                grupo.at_prf_see_produto.map(
                  (produto, index) =>
                    !produto.nm_produto && (
                      <SelectDropdown
                        key={index + 741}
                        label="Adicionar produto"
                        options={filterAddProdutoOptions(grupo)}
                        onSelect={(p: any, grupo: any) =>
                          handleSelectProduto(p, grupo)
                        }
                      />
                    )
                )}
            </>
          )}
        </View>
      ))}

      <View style={styles.buttonsContainer}>
        <Button
          onPress={addGrupo}
          textColor={
            enableAddGrupo
              ? globalColors.primary[900]
              : globalColors.grayscale[400]
          }
          buttonColor={globalColors.grayscale[200]}
          icon={"plus"}
          disabled={!enableAddGrupo}
        >
          Adicionar Grupo
        </Button>
      </View>

      <View></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "bold",
    margin: "3%",
  },
  groupContainer: {
    marginTop: "2%",
    marginHorizontal: "5%",
  },
  titleContainer: {
    paddingLeft: "3%",
    paddingVertical: "1.5%",
    backgroundColor: globalColors.primary[100],
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    textTransform: "capitalize",
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: "5%",
    width: "auto",
  },
});
