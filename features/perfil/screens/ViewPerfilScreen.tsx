import { ScrollView, StyleSheet, View, Text } from "react-native";
import { formatDate } from "@shared/utils";
import {
  perfilForm,
  producaoIndustrialForm,
  producaoNaturaForm,
} from "../constants";
import { FormFieldContainer } from "@shared/components/molecules";
import { Perfil } from "../types/Perfil";

export const ViewPerfilScreen = ({ route }: any) => {
  const { perfil }: { perfil: Perfil } = route.params;
  const { atividade } = perfil.at_prf_see_propriedade;

  const {
    dados_producao_agro_industria,
    dados_producao_in_natura,
    at_prf_see_propriedade,
    ...updatedPerfil
  } = perfil;

  if (
    Object.values(dados_producao_agro_industria).some((value) => value !== null)
  ) {
    Object.assign(updatedPerfil, dados_producao_agro_industria);
  }
  if (Object.values(dados_producao_in_natura).some((value) => value !== null)) {
    Object.assign(updatedPerfil, dados_producao_in_natura);
  }
  if (Object.values(at_prf_see_propriedade).some((value) => value !== null)) {
    Object.assign(updatedPerfil, at_prf_see_propriedade);
  }

  const parseValue = (value: unknown) => {
    switch (typeof value) {
      case "string":
        return value;
      case "number":
        return value.toString();
      case "object":
        if (value === null) {
          return "";
        }
        if (value instanceof Date) {
          return formatDate(value.toISOString());
        }
      case "boolean":
        return value ? "Sim" : "Não";
      default:
        return "";
    }
  };

  const date = formatDate(perfil?.data_preenchimento);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{`Perfil cadastrado em ${date}`}</Text>
      {perfilForm.map(({ field, label }) => (
        <FormFieldContainer label={label} key={field}>
          <View>
            <Text style={styles.text}>
              {" "}
              {/*@ts-ignore */}
              {parseValue(updatedPerfil[field as keyof Partial<Perfil>])}
            </Text>
          </View>
        </FormFieldContainer>
      ))}
      {(atividade === "ATIVIDADE_PRIMARIA" || atividade === "AMBAS") && (
        <>
          <Text style={{ ...styles.title, marginTop: 20 }}>
            DADOS DA PRODUÇÃO IN NATURA
          </Text>
          {producaoNaturaForm.map(({ field, label }) => (
            <FormFieldContainer label={label} key={field}>
              <View>
                <Text style={styles.text}>
                  {" "}
                  {/*@ts-ignore */}
                  {parseValue(updatedPerfil[field as keyof Partial<Perfil>])}
                </Text>
              </View>
            </FormFieldContainer>
          ))}
        </>
      )}
      {(atividade === "ATIVIDADE_SECUNDARIA" || atividade === "AMBAS") && (
        <>
          <Text style={{ ...styles.title, marginTop: 20 }}>
            DADOS DA PRODUÇÃO DE AGROINDÚSTRIA
          </Text>
          {producaoIndustrialForm.map(({ field, label }) => (
            <FormFieldContainer label={label} key={field}>
              <View>
                <Text style={styles.text}>
                  {" "}
                  {/*@ts-ignore */}
                  {parseValue(updatedPerfil[field as keyof Partial<Perfil>])}
                </Text>
              </View>
            </FormFieldContainer>
          ))}
        </>
      )}

      <View style={{ marginVertical: 20 }}></View>
    </ScrollView>
  );
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
  },
  text: {
    marginLeft: 10,
    fontSize: 12,
  },
});
