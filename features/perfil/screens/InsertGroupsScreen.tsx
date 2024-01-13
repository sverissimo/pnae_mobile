import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useManageGrupos } from "../hooks/useManageGrupos";
import { useCustomNavigation } from "@navigation/hooks";
import { useEffect, useState } from "react";
import {
  GrupoDetails,
  GrupoProdutos,
  Produto,
  ProdutoDetails,
} from "@domain/perfil";
import { ProdutosDetailsInput } from "../components/ProdutosDetailsInput";
import { globalColors } from "@constants/themes";
import { Button } from "react-native-paper";
import { GrupoProdutoSelector } from "../components/GrupoProdutoSelector";
import { SelectDropdown } from "@shared/components/organisms";

export const InsertGroupsScreen = ({ route }: any) => {
  const { gruposOptions: allGrupos, produtosOptions: allProdutos } =
    useManageGrupos();

  const { navigation } = useCustomNavigation();
  const { parentRoute, item } = route.params;
  const [selectedGrupo, setSelectedGrupo] = useState<GrupoDetails>();
  const [selectedProduto, setSelectedProduto] = useState<ProdutoDetails>();
  const { field } = item;

  const [gruposOptions, setGruposOptions] = useState<GrupoDetails[]>([]);
  const [produtosOptions, setProdutosOptions] = useState<ProdutoDetails[]>([]);
  const [selectedGrupos, setSelectedGrupos] = useState<GrupoProdutos[]>([
    {} as GrupoProdutos,
  ]);
  const [selectedProdutos, setSelectedProdutos] = useState<ProdutoDetails[]>(
    []
  );

  const [savedProdutos, setSavedProdutos] = useState<Produto[]>([]);

  const [state, setstate] = useState<Record<string, any>>({});
  console.log("🚀 - InsertGroupsScreen - state:", state);

  useEffect(() => {
    const filteredGrupos = allGrupos.filter((g) =>
      field === "gruposNaturaOptions" ? g.tipo === 1 : g.tipo === 0
    );
    setGruposOptions(filteredGrupos);

    const filteredProdutos = allProdutos?.filter((p) =>
      field === "gruposNaturaOptions" ? p.tipo === 1 : p.tipo === 0
    );
    setProdutosOptions(filteredProdutos);
  }, [allGrupos, allProdutos, field]);

  const handleSelectGrupo = (grupo: string) => {
    const grupoDetails = gruposOptions.find(
      (g) => g.nm_grupo === grupo
    )! as GrupoProdutos;

    grupoDetails.at_prf_see_produto = [{} as Produto];

    const grupos = [...selectedGrupos];
    const index = grupos.findIndex((g) => Object.keys(g).length === 0);
    grupos[index] = grupoDetails;

    setSelectedGrupos(grupos);

    const filteredProdutos = allProdutos
      ?.filter(
        (p) =>
          p.id_grupo_legado ===
          gruposOptions.find((g) => g.nm_grupo === grupo)?.id_grupo_legado
      )
      .sort((a, b) => a.nm_produto.localeCompare(b.nm_produto));
    setProdutosOptions(filteredProdutos);
  };

  const handleSelectProduto = (produto: string) => {
    const selectedProduto = produtosOptions.find(
      (p) => p.nm_produto === produto
    )!;
    const produtos = [...selectedProdutos] as Produto[];

    const productIndex = produtos.findIndex((p) => !p.nm_produto);
    if (productIndex !== -1) {
      produtos[productIndex] = selectedProduto as Produto;
    } else {
      produtos.push(selectedProduto as Produto);
    }
    produtos.push({} as Produto);

    console.log("🚀 - handleSelectProduto - produtos:", produtos);

    const selectedGroup = gruposOptions.find(
      (g) => g.id_grupo_legado == selectedProduto?.id_grupo_legado
    )!;

    const index = selectedGrupos.findIndex(
      (g) => g?.nm_grupo === selectedGroup.nm_grupo
    );

    const updatedGrupos = [...selectedGrupos];
    updatedGrupos[index].at_prf_see_produto = produtos;
    setSelectedGrupos(updatedGrupos);

    setSelectedProdutos(produtos);
  };

  const onValueChange = (field: string, value: number) => {
    if (!selectedProduto?.nm_produto || !selectedGrupo?.nm_grupo) return;
    const grupo = selectedGrupo?.nm_grupo!;
    const produto = selectedProduto?.nm_produto!;
    const produtoDetails = { [field]: value };
    const stateUpdate = {
      [grupo]: {
        [produto]: {
          ...state[produto],
          ...produtoDetails,
        },
      },
    };
    setstate((prev) => ({
      ...prev,
      ...stateUpdate,
    }));
  };

  const addGrupo = () => {
    const grupos = [...selectedGrupos];
    grupos.push({} as GrupoProdutos);
    setSelectedGrupos(grupos);
  };

  // Use this function to update the details of a specific produto within a grupo
  // const updateProdutoDetails = (grupoId, produtoId, details) => {
  //   const newSavedGrupos = savedGrupos.map(grupo => {
  //     if (grupo.id_grupo === grupoId) {
  //       return {
  //         ...grupo,
  //         produtos: grupo.produtos.map(produto => {
  //           if (produto.id_produto === produtoId) {
  //             return { ...produto, details: { ...produto.details, ...details } };
  //           }
  //           return produto;
  //         }),
  //       };
  //     }
  //     return grupo;
  //   });
  //   setSavedGrupos(newSavedGrupos);
  // };

  return (
    <ScrollView>
      <Text>
        {field === "gruposNaturaOptions"
          ? "Grupos de Produtos in Natura"
          : "Grupos de Produtos Industriais"}
      </Text>
      {selectedGrupos.map((grupo, index) => (
        <View key={index}>
          <SelectDropdown
            label="Adicionar grupo"
            options={gruposOptions.map((g) => g.nm_grupo)}
            onSelect={(group: string) => handleSelectGrupo(group)}
          />
          {grupo?.nm_grupo &&
            grupo.at_prf_see_produto.map((produto) =>
              !produto.nm_produto ? (
                <SelectDropdown
                  key={produto.id_produto}
                  label="Adicionar produto"
                  options={produtosOptions.map((p) => p.nm_produto)}
                  onSelect={(product: string) => handleSelectProduto(product)}
                />
              ) : (
                <ProdutosDetailsInput
                  key={produto.id_produto}
                  selectedProduto={produto}
                  onValueChange={onValueChange}
                />
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
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
