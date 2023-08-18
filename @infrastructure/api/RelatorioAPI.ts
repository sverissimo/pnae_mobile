import { RelatorioDTO } from "@infrastructure/database/dto/RelatorioDTO";
import { env } from "config";
import * as FileSystem from "expo-file-system";

export const RelatorioAPI = { sendFormData };
const url = `${env.BASE_URL}/relatorio`;
const TST_DATA = {
  assinatura_uri:
    "file:///data/user/0/host.exp.exponent/cache/signature_1692327161198.png",
  assunto: "mtherfkr!!!",
  numero_relatorio: 456,
  orientacao: "1234",
  picture_uri:
    "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fpnae_mobile-a4b9289e-2812-49a3-9b18-9dd82a6f9e84/ImagePicker/9e2a4e93-b937-4b81-9246-4c2ab834dd47.jpeg",
  produtor_id: "363189",
  tecnico_id: "835",
};

async function sendFormData(relatorioDTO: RelatorioDTO) {
  try {
    const formData = new FormData();

    // Add the picture file to the form data
    const pictureFile = await FileSystem.readAsStringAsync(
      relatorioDTO.picture_uri,
      {
        encoding: FileSystem.EncodingType.Base64,
      }
    );
    const pictureBlob = new Blob([pictureFile], { type: "image/jpeg" });
    formData.append("picture", pictureBlob, "picture.jpg");

    // Add the signature file to the form data
    if (relatorioDTO.assinatura_uri) {
      const signatureFile = await FileSystem.readAsStringAsync(
        relatorioDTO.assinatura_uri,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );
      const signatureBlob = new Blob([signatureFile], { type: "image/jpeg" });
      formData.append("signature", signatureBlob, "signature.jpg");
    }

    // Add the other fields to the form data
    Object.keys(relatorioDTO).forEach((key) => {
      if (key !== "picture_uri" && key !== "assinatura_uri") {
        formData.append(key, relatorioDTO[key]);
      }
    });

    // Send the form data to the backend
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
  }
}
