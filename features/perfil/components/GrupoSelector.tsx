import { Text, View } from "react-native";
import { SelectDropdown } from "@shared/components/organisms";
import { GrupoDetails, ProdutoDetails } from "../types";

type GrupoProdutoSelectorProps = {
  gruposOptions: GrupoDetails[];
  produtosOptions: ProdutoDetails[];
  selectedGrupo: GrupoDetails | undefined;
  field: string;
  handleSelectGrupo: (grupo: string) => void;
  handleSelectProduto: (produto: string) => void;
};

export const GrupoProdutoSelector = ({
  gruposOptions,
  produtosOptions,
  selectedGrupo,
  field,
  handleSelectGrupo,
  handleSelectProduto,
}: GrupoProdutoSelectorProps) => {
  return (
    <>
      <Text>
        {field === "gruposNaturaOptions"
          ? "Grupos de Produtos in Natura"
          : "Grupos de Produtos Industriais"}
      </Text>
      <SelectDropdown
        key={"gruposOptions"}
        label="Adicionar grupo"
        options={gruposOptions.map((g) => g.nm_grupo)}
        onSelect={(group: string) => handleSelectGrupo(group)}
      />
      {selectedGrupo && (
        <SelectDropdown
          key={"produtosOptions"}
          label="Adicionar produto"
          options={produtosOptions.map((p) => p.nm_produto)}
          onSelect={(product: string) => handleSelectProduto(product)}
        />
      )}
    </>
  );
};
