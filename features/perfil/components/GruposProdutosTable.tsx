import { View, Text, StyleSheet } from "react-native";
import { GrupoProdutos, Produto } from "../types";

type Props = {
  grupoProdutos: GrupoProdutos[];
  type: "inNatura" | "industrial";
};

export const GruposProdutosTable: React.FC<Props> = ({
  grupoProdutos,
  type,
}) => {
  const sumProperty = (produtos: Produto[], property: keyof Produto) =>
    produtos.reduce((acc, produto) => acc + (+produto[property] || 0), 0);

  return (
    <View style={styles.container}>
      {grupoProdutos.map((grupo, index) => (
        <View key={grupo.id} style={styles.table}>
          <Text style={styles.subTitle}>{grupo.nm_grupo.toLowerCase()}</Text>
          <View style={styles.row}>
            <Text style={styles.header}>Nome do Produto</Text>
            <Text style={styles.header}>Unidade de Medida</Text>
            {type === "inNatura" && (
              <Text style={styles.header}>Área Utilizada (ha)</Text>
            )}
            <Text style={styles.header}>Produção PNAE do Último Ano</Text>
            <Text style={styles.header}>Produção Total do Último Ano</Text>
          </View>
          {grupo.at_prf_see_produto.map((produto) => (
            <View key={produto.nm_produto} style={styles.row}>
              <Text style={styles.cell}>{produto.nm_produto}</Text>
              <Text style={styles.cell}>{produto.sg_und_medida}</Text>
              {type === "inNatura" && (
                <Text style={styles.cell}>{produto.area_utilizada}</Text>
              )}
              <Text style={styles.cell}>
                {produto.producao_aproximada_ultimo_ano_pnae}
              </Text>
              <Text style={styles.cell}>
                {produto.producao_aproximada_ultimo_ano_total}
              </Text>
            </View>
          ))}
          <View style={styles.row}>
            <Text style={styles.cellTotal}>TOTAL</Text>
            <Text style={styles.cell}> - </Text>
            {type === "inNatura" && (
              <Text style={styles.cell}>
                {sumProperty(grupo.at_prf_see_produto, "area_utilizada") ||
                  grupo.area_utilizada}
              </Text>
            )}
            <Text style={styles.cell}>
              {sumProperty(
                grupo.at_prf_see_produto,
                "producao_aproximada_ultimo_ano_pnae"
              ) || grupo.producao_aproximada_ultimo_ano_pnae}
            </Text>
            <Text style={styles.cell}>
              {sumProperty(
                grupo.at_prf_see_produto,
                "producao_aproximada_ultimo_ano_total"
              ) || grupo.producao_aproximada_ultimo_ano_total}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    borderRadius: 5,
    // padding: 2,
  },
  table: {
    backgroundColor: "#fefefe",
    marginBottom: 5,
    borderRadius: 5,
    padding: 10,
    paddingLeft: 5,
    paddingBottom: 15,
    borderColor: "#bbb",
    borderWidth: 0.8,
    // elevation: 1,
  },
  subTitle: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#343a40",
    marginBottom: 5,
    marginLeft: 7,
    textTransform: "capitalize",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
    paddingVertical: 5,
  },
  header: {
    flex: 1,
    fontSize: 10,
    fontWeight: "500",
    color: "#495057",
    textAlign: "center",
  },
  cell: {
    flex: 1,
    fontSize: 11,
    color: "#495057",
    textAlign: "center",
  },
  cellTotal: {
    flex: 1,
    fontSize: 11,
    color: "#495057",
    textAlign: "center",
    fontWeight: "500",
  },
});
