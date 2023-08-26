import { Relatorio } from "features/relatorio/types/Relatorio";
import { env } from "config";

export const RelatorioAPI = { createRelatorio };
const url = `${env.BASE_URL}/relatorios`;

async function createRelatorio(relatorioDTO: Relatorio) {
  if (!relatorioDTO) return null;
  console.log(
    "🚀 ~ file: RelatorioAPI.ts:9 ~ createRelatorio ~ relatorioDTO:",
    relatorioDTO
  );
  try {
    const formData: any = new FormData();
    Object.entries(relatorioDTO).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (relatorioDTO?.pictureURI) {
      formData.append("foto", {
        uri: relatorioDTO?.pictureURI,
        name: "foto_visita.png",
        type: "image/png",
      });
    }

    if (relatorioDTO?.assinaturaURI) {
      formData.append("assinatura", {
        uri: relatorioDTO?.assinaturaURI,
        name: "assinatura.png",
        type: "image/png",
      });
    }

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const responseData = await response.json();
    console.log("Form data submitted successfully:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error submitting form data:", error);
    return null;
  } finally {
    console.log("finally");
  }
}

/*
async function createRelatorio(relatorio: Relatorio) {
  if (!relatorio) return null;
  try {
    const formData = [];

    // Add the other fields to the form data
    Object.entries(relatorio).forEach(([key, value]) => {
      if (!!key && key !== "pictureURI" && key !== "assinaturaURI") {
        formData.push({
          name: key,
          data: value,
        });
      }
    });

    if (relatorio?.pictureURI) {
      const pictureFile = ReactNativeBlobUtil.wrap(relatorio?.pictureURI);
      formData.push({
        name: "foto",
        filename: "foto.png",
        type: "image/png",
        data: pictureFile,
      });
    }

    if (relatorio?.assinaturaURI) {
      const signatureFile = ReactNativeBlobUtil.wrap(relatorio.assinaturaURI);
      formData.push({
        name: "assinatura",
        filename: "assinatura.png",
        type: "image/png",
        data: signatureFile,
      });
    }

    //@ts-ignore
    for (const part of formData.getParts()) {
      console.log(
        "🚀 ~ file: RelatorioAPI.ts:58 ~ createRelatorio ~ part:",
        part
      );
    }

    const response = await ReactNativeBlobUtil.fetch(
      "POST",
      url,
      {
        "Content-Type": "multipart/form-data",
      },
      formData
    );

    console.log(response.data);
  } catch (error) {
    console.log("Error uploading relatorio:", error);
  }
}
 */
