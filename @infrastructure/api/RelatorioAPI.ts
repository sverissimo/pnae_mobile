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
