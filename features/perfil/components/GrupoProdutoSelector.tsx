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
      <SelectDropdown
        label="Adicionar grupo"
        options={gruposOptions.map((g) => g.nm_grupo)}
        onSelect={(group: string) => handleSelectGrupo(group)}
      />
      {selectedGrupo && (
        <SelectDropdown
          label="Adicionar produto"
          options={produtosOptions.map((p) => p.nm_produto)}
          onSelect={(product: string) => handleSelectProduto(product)}
        />
      )}
    </>
  );
};
