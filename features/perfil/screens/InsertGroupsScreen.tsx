import { useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useManageGrupos } from "../hooks/useManageGrupos";
import { useCustomNavigation } from "@navigation/hooks";
import { GrupoDetails, GrupoProdutos, ProdutoDetails } from "@domain/perfil";
import { ProdutosDetailsInput } from "../components/ProdutosDetailsInput";
import { Button } from "react-native-paper";
import { SelectDropdown } from "@shared/components/organisms";
import { globalColors } from "@constants/themes";

export const InsertGroupsScreen = ({ route }: any) => {
  const { navigation } = useCustomNavigation();
  const { parentRoute, item } = route.params;
  const { field } = item;

  const {
    selectedGrupos,
    availableGrupos,
    handleSelectGrupo,
    handleSelectProduto,
    addGrupo,
    filterAddProdutoOptions,
    removeProduto,
  } = useManageGrupos(field);

  console.log(
    "🚀 - InsertGroupsScreen - selectedGrupos:",
    JSON.stringify(selectedGrupos)
  );

  const [activeProduto, setActiveProduto] = useState<ProdutoDetails>();
  const [state, setstate] = useState<GrupoProdutos[]>([]);

  // console.log("🚀 - InsertGroupsScreen - state:", JSON.stringify(state));

  const onValueChange = (field: string, value: number) => {
    if (!activeProduto?.nm_produto) return;

    const grupoIndex = selectedGrupos.findIndex((g) =>
      g.at_prf_see_produto.find(
        (p) => p.nm_produto === activeProduto?.nm_produto
      )
    );
    if (grupoIndex === -1) return;
    const produtoIndex = selectedGrupos[
      grupoIndex
    ].at_prf_see_produto.findIndex(
      (p) => p.nm_produto === activeProduto?.nm_produto
    );
    if (produtoIndex === -1) return;

    const produtoDetails = { [field]: value };

    const stateUpdate = [...selectedGrupos];
    stateUpdate[grupoIndex].at_prf_see_produto[produtoIndex] = {
      ...selectedGrupos[grupoIndex].at_prf_see_produto[produtoIndex],
      ...produtoDetails,
    };
    // const stateUpdate = {...selectedGrupos[grupoIndex].at_prf_see_produto[produtoIndex], ...produtoDetails }

    setstate(stateUpdate);
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
            <SelectDropdown
              key={groupIndex + 100}
              label="Adicionar grupo"
              options={availableGrupos}
              onSelect={(group: string) => handleSelectGrupo(group)}
            />
          )}
          {grupo?.nm_grupo &&
            grupo.at_prf_see_produto.map((produto, index) =>
              !produto.nm_produto &&
              filterAddProdutoOptions(grupo).length > 0 ? (
                <SelectDropdown
                  key={produto.id_produto}
                  label="Adicionar produto"
                  options={filterAddProdutoOptions(grupo)}
                  onSelect={(product: string) => handleSelectProduto(product)}
                />
              ) : (
                produto.nm_produto && (
                  <ProdutosDetailsInput
                    key={produto.id_produto + index}
                    setActiveProduto={setActiveProduto}
                    selectedProduto={produto}
                    onValueChange={onValueChange}
                    removeProduto={() => removeProduto(produto)}
                  />
                )
              )
            )}
        </View>
      ))}

      <View style={styles.buttonsContainer}>
        <Button
          onPress={addGrupo}
          textColor={globalColors.primary[900]}
          buttonColor={globalColors.grayscale[200]}
          icon={"plus"}
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

//     useEffect(() => {
//         navigation.setOptions({
//             title: item.label,
//             headerLeft: () => (
//                 <View style={{ marginRight: 30 }}>
//                     <Icon iconName="arrow-back" size={26} onPress={handleBackPress} />
//                 </View>
//             ),
//         });
//     }, [navigation, selectedItems]);

//   const handleBackPress = () => {
//           navigation.navigate("CreatePerfilScreen", { key: item.field, selectedItems:[] });
//       };
