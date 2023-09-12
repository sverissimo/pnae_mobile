import { useEffect } from "react";
import { Image, ScrollView, StyleSheet, View, Text } from "react-native";
import { useManageRelatorio } from "../hooks";
import { useManagePictures } from "@shared/hooks";
import { ListTitle } from "@shared/components/atoms";
import { Relatorio } from "../types/Relatorio";
import { RichEditor } from "react-native-pell-rich-editor";
import { useSelectProdutor } from "@features/produtor/hooks";
import { formatDate } from "@shared/utils";

export const ViewRelatorioScreen = ({ route }: any) => {
  const { relatorio, setRelatorio, relatorios } = useManageRelatorio();
  const { produtor } = useSelectProdutor();
  const nomeProdutor = produtor?.nm_pessoa || "";
  const { pictureURI, setPicture, assinaturaURI, setAssinatura } =
    useManagePictures();

  const { relatorioId } = route.params;

  useEffect(() => {
    const originalRelatorio = relatorios.find(
      (r) => r!.id === relatorioId
    ) as Relatorio;
    if (!originalRelatorio) return;
    setRelatorio({ ...originalRelatorio });
    setPicture(originalRelatorio.pictureURI);
    setAssinatura(originalRelatorio.assinaturaURI);
  }, [relatorios]);
  const date = formatDate(relatorio?.createdAt);
  return (
    <ScrollView style={styles.container}>
      <ListTitle
        title={`Relatório nº ${relatorio.numeroRelatorio} - ${date}`}
      />
      <ListTitle title={"Assunto"} />
      <View style={styles.assuntoContainer}>
        <Text style={{ fontSize: 12 }}>{relatorio.assunto}</Text>
      </View>
      <ListTitle title="Orientações" />
      <ScrollView style={styles.orientacaoContainer} nestedScrollEnabled>
        <RichEditor
          initialContentHTML={relatorio?.orientacao}
          disabled={true}
          editorStyle={{
            contentCSSText: "font-size: 12px;",
          }}
        />
      </ScrollView>

      {assinaturaURI && (
        <>
          <ListTitle title="Assinatura do Proprietário" />
          <View
            style={{ ...styles.pictureContainer, backgroundColor: "white" }}
          >
            <Image source={{ uri: assinaturaURI }} style={styles.assinatura} />

            <Text style={styles.assinaturaLabel}>{nomeProdutor}</Text>
          </View>
        </>
      )}
      {/*********** TODO: Adicionar cálculo de largura/altura ao useManageImage e reproduzir aqui as props.
       * Ver chatGPT  */}
      {pictureURI && (
        <>
          <ListTitle title="Foto da Visita" />
          <View style={styles.pictureContainer}>
            <Image source={{ uri: pictureURI }} style={styles.picture} />
          </View>
        </>
      )}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },
  assuntoContainer: {
    flex: 1,
    alignItems: "flex-start",
    padding: 15,
    backgroundColor: "white",
    borderBlockColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
  },
  orientacaoContainer: {
    maxHeight: 300,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
  },
  orientacaoText: {
    fontSize: 12,
  },
  pictureContainer: {
    flex: 1,
    alignItems: "center",
    marginRight: "2%",
    padding: 15,
    borderBlockColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
  },
  assinatura: {
    width: 80,
    height: 80,
  },
  assinaturaLabel: {
    width: "70%",
    paddingTop: 5,
    borderTopColor: "#555",
    borderTopWidth: 1,
    textAlign: "center",
  },
  picture: {
    width: 300,
    height: 300,
  },
});
