import { env } from "@config/env";

// import { RelatorioBackendDTO } from "@features/relatorio/types/RelatorioModel";
import { parseURI } from "@shared/utils/parseURI";
import { RelatorioBackendDTO } from "./dto";

export const RelatorioAPI = {
  createRelatorio,
  getRelatorios,
  updateRelatorio,
  deleteRelatorio,
};
const url = `${env.SERVER_URL}/relatorios`;

async function createRelatorio(relatorioDTO: Partial<RelatorioBackendDTO>) {
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

async function getRelatorios(produtorId: string): Promise<any> {
  const result = await fetch(`${url}?produtorId=${produtorId}`);
  return await result.json();
}

async function updateRelatorio(
  relatorioInput: RelatorioBackendDTO
): Promise<string> {
  const { id, ...relatorio } = relatorioInput;
  const formData: any = new FormData();
  Object.entries(relatorio).forEach(([key, value]) => {
    if (key === "pictureURI" || key === "assinaturaURI") {
      formData.append(key, parseURI(value)?.split(".")[0]);
      return;
    }
    formData.append(key, value);
  });

  if (relatorio?.pictureURI) {
    formData.append("foto", {
      uri: relatorio.pictureURI,
      name: parseURI(relatorio.pictureURI),
      type: "image/png",
    });
  }

  if (relatorio?.assinaturaURI) {
    formData.append("assinatura", {
      uri: relatorio.assinaturaURI,
      name: parseURI(relatorio.assinaturaURI),
      type: "image/png",
    });
  }

  const response = await fetch(`${url}/${id}`, {
    method: "PATCH",
    body: formData,
  });

  const responseData = await response.text();
  console.log("Form data submitted successfully:", responseData);
  return responseData;
}

async function deleteRelatorio(relatorioId: string): Promise<string> {
  const result = await fetch(`${url}/${relatorioId}`, {
    method: "DELETE",
  });
  const responseData = await result.text();
  console.log("🚀 ~ file: RelatorioAPI.ts:118 ~ responseData:", responseData);
  return responseData;
}
