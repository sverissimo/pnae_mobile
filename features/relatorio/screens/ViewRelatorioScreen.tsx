import { useEffect, useMemo } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { RichEditor } from "react-native-pell-rich-editor";

import { useSelectProdutor } from "@features/produtor/hooks";
import { ListTitle } from "@shared/components/atoms";
import { useManagePictures, useSnackBar } from "@shared/hooks";
import { formatDate } from "@shared/utils";
import { useManageRelatorio } from "../hooks";
import { RelatorioModel } from "../types";

export const ViewRelatorioScreen = ({ route }: any) => {
  const { produtor } = useSelectProdutor();
  const { setSnackBarOptions } = useSnackBar();
  const { relatorio, setRelatorio, relatorios } = useManageRelatorio();
  const {
    pictureURI,
    assinaturaURI,
    setPicture,
    setAssinatura,
    downloadPictureAndSignature,
  } = useManagePictures();

  const nomeProdutor = produtor?.nm_pessoa || "";
  const { relatorioId } = route.params;

  useEffect(() => {
    const originalRelatorio = relatorios.find(
      (r) => r!.id === relatorioId
    ) as RelatorioModel;

    if (!originalRelatorio) return;
    setRelatorio({ ...originalRelatorio });

    downloadPictureAndSignature(originalRelatorio).catch((err) => {
      console.log("🚀 ViewRelatorioScreen 37: useEffect - err:", err);
      setSnackBarOptions({
        status: "error",
        message: "Erro ao baixar assinatura e/ou foto",
      });
    });

    return () => {
      setRelatorio({} as RelatorioModel);
      setPicture("");
      setAssinatura("");
    };
  }, []);

  const imageKey = useMemo(() => {
    if (pictureURI && assinaturaURI) {
      return `${pictureURI}-${assinaturaURI}`;
    }
    return `picture-${pictureURI || "loading"}-signature-${
      assinaturaURI || "loading"
    }`;
  }, [pictureURI, assinaturaURI]);

  const date = formatDate(relatorio?.createdAt);
  return (
    <ScrollView style={styles.container}>
      <ListTitle
        title={`Relatório nº ${relatorio.numeroRelatorio} - ${date}`}
      />
      {relatorio?.atendimentoId && (
        <ListTitle title={`Id do Atendimento - ${relatorio.atendimentoId}`} />
      )}

      {relatorio?.nomeOutroExtensionista && (
        <>
          <ListTitle title="Extensionistas" />
          <View style={styles.assuntoContainer}>
            <Text style={{ fontSize: 12 }}>{relatorio.nomeTecnico}</Text>
            {relatorio?.outroExtensionista?.map((extensionista) => (
              <Text
                style={{ fontSize: 12 }}
                key={extensionista.matricula_usuario}
              >
                {extensionista.nome_usuario}
              </Text>
            ))}
          </View>
        </>
      )}
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
          <View style={styles.assinaturaContainer}>
            <Image
              source={{ uri: assinaturaURI }}
              style={styles.assinatura}
              key={imageKey}
            />
            <Text style={styles.assinaturaLabel}>{nomeProdutor}</Text>
          </View>
        </>
      )}
      {pictureURI && (
        <>
          <ListTitle title="Foto da Visita" />
          <View style={styles.pictureContainer}>
            <Image
              source={{ uri: pictureURI }}
              style={styles.picture}
              key={imageKey}
            />
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
  assinaturaContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingTop: 30,
    borderBlockColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    width: "100%",
    height: 200,
  },
  assinatura: {
    minWidth: 230,
    minHeight: 85,
    width: "85%",
    height: "85%",
  },
  assinaturaLabel: {
    width: "85%",
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
