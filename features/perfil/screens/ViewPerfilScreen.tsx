import { ScrollView, StyleSheet, View, Text } from "react-native";

import { GruposProdutosTable } from "../components";
import { FormFieldContainer } from "@shared/components/molecules";
import { formatDate, parseValue } from "@shared/utils";
import {
  viewPerfilForm,
  producaoIndustrialForm,
  producaoNaturaForm,
} from "../constants";
import { PerfilModel } from "@domain/perfil";

export const ViewPerfilScreen = ({ route }: any) => {
  const { perfil, municipio } = route.params;
  const { atividade } = perfil.at_prf_see_propriedade;
  const {
    dados_producao_agro_industria,
    dados_producao_in_natura,
    at_prf_see_propriedade,
  } = perfil;

  const updatedPerfil = {
    ...perfil,
    ...dados_producao_agro_industria,
    ...dados_producao_in_natura,
    ...at_prf_see_propriedade,
    municipio,
  };
  // console.log(
  //   "🚀 - ViewPerfilScreen - dados_producao_in_natura:",
  //   JSON.stringify(dados_producao_in_natura.at_prf_see_grupos_produtos)
  // );

  const date = formatDate(perfil?.data_preenchimento);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{`Perfil cadastrado em ${date}`}</Text>
      {viewPerfilForm.map(({ field, label }) => (
        <FormFieldContainer label={label} key={field}>
          <View>
            <Text style={styles.text}>
              {parseValue(updatedPerfil[field as keyof Partial<PerfilModel>])}
            </Text>
          </View>
        </FormFieldContainer>
      ))}
      {["Atividade Primária", "Ambas"].includes(atividade) && (
        <Section
          title="DADOS DA PRODUÇÃO IN NATURA"
          form={producaoNaturaForm}
          grupoProdutos={dados_producao_in_natura.at_prf_see_grupos_produtos}
          type="inNatura"
        />
      )}
      {["Atividade Secundária", "Ambas"].includes(atividade) && (
        <Section
          title="DADOS DA PRODUÇÃO DE AGROINDÚSTRIA"
          form={producaoIndustrialForm}
          grupoProdutos={
            dados_producao_agro_industria.at_prf_see_grupos_produtos
          }
          type="industrial"
        />
      )}
      <View style={{ marginVertical: 20 }} />
    </ScrollView>
  );

  function Section({ title, form, grupoProdutos, type }: any) {
    return (
      <>
        <Text style={{ ...styles.title, marginTop: 20 }}>{title}</Text>
        <GruposProdutosTable grupoProdutos={grupoProdutos} type={type} />
        {form.map(({ field, label }: any) => (
          <FormFieldContainer label={label} key={field}>
            <View>
              <Text style={styles.text}>
                {parseValue(updatedPerfil[field as keyof Partial<PerfilModel>])}
              </Text>
            </View>
          </FormFieldContainer>
        ))}
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
    backgroundColor: "white",
  },
  fieldContainer: {
    flex: 1,
    flexDirection: "row",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    marginLeft: 10,
    fontSize: 12,
  },
});
