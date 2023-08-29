import { Relatorio } from "features/relatorio/types/Relatorio";
import { env } from "config";
import { parseURI } from "@shared/utils/parseURI";

export const RelatorioAPI = { createRelatorio, deleteRelatorio };
const url = `${env.BASE_URL}/relatorios`;

async function createRelatorio(relatorioDTO: Relatorio) {
  if (!relatorioDTO) return null;
  try {
    const formData: any = new FormData();
    Object.entries(relatorioDTO).forEach(([key, value]) => {
      if (key === "pictureURI" || key === "assinaturaURI") {
        formData.append(key, parseURI(value)?.split(".")[0]);
        return;
      }
      formData.append(key, value);
    });

    if (relatorioDTO?.pictureURI) {
      formData.append("foto", {
        uri: relatorioDTO.pictureURI,
        name: parseURI(relatorioDTO.pictureURI),
        type: "image/png",
      });
    }

    if (relatorioDTO?.assinaturaURI) {
      formData.append("assinatura", {
        uri: relatorioDTO.assinaturaURI,
        name: parseURI(relatorioDTO.assinaturaURI),
        type: "image/png",
      });
    }

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const responseData = await response.text();
    console.log("Form data submitted successfully:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error submitting form data:", error);
    return null;
  }
}

async function getRelatorios(produtorId: string): Promise<string> {
  return "To do...";
}

async function deleteRelatorio(relatorioId: string): Promise<string> {
  const result = await fetch(`${url}/${relatorioId}`, {
    method: "DELETE",
  });
  const responseData = await result.text();
  console.log("🚀 ~ file: RelatorioAPI.ts:118 ~ responseData:", responseData);
  return responseData;
}
