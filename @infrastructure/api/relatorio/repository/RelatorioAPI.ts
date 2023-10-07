import { env } from "@config/env";

// import { RelatorioBackendDTO } from "@features/relatorio/types/RelatorioModel";
import { parseURI } from "@shared/utils/parseURI";
import { RelatorioBackendDTO } from "../dto";
import { RelatorioRepository } from "@domain/relatorio/repository/RelatorioRepository";
import { RelatorioModel } from "@features/relatorio/types";
import { API } from "@infrastructure/api/API";
import { Relatorio } from "@features/relatorio/entity";

export class RelatorioAPI implements RelatorioRepository {
  private api = new API();
  private url = `${env.SERVER_URL}/relatorios`;

  private async createFormData(
    relatorio: Partial<RelatorioBackendDTO>
  ): Promise<FormData> {
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

    return formData;
  }

  private toDTO(relatorio: RelatorioModel): RelatorioBackendDTO {
    const {
      nomeTecnico,
      outroExtensionista,
      nomeOutroExtensionista,
      matriculaOutroExtensionista,
      ...rest
    } = relatorio;

    const relatorioDTO = rest as RelatorioBackendDTO;

    relatorioDTO.outroExtensionista = new Relatorio(
      relatorio
    ).getOutrosExtensionistasIds();

    return relatorioDTO;
  }

  async create(relatorio: RelatorioModel): Promise<void> {
    if (!relatorio) throw new Error("Relatorio não pode ser vazio");
    try {
      const relatorioDTO = this.toDTO(relatorio);
      const formData = await this.createFormData(relatorioDTO);
      const response = await this.api.post(this.url, formData);
      console.log("Form data submitted successfully:", response);
    } catch (error) {
      console.error("RelatorioAPI.ts:49 - error submitting form data: ", error);
      throw error;
    }
  }

  async findByProdutorID(produtorId: string): Promise<any> {
    const result = await this.api.get(`${this.url}?produtorId=${produtorId}`);
    return result;
  }

  async update(relatorioInput: RelatorioModel): Promise<void> {
    const relatorio = this.toDTO(relatorioInput);
    const { id, ...relatorioDTO } = relatorio;
    const formData = await this.createFormData(relatorioDTO);

    const response = await this.api.patch(`${this.url}/${id}`, formData);
    console.log("Form data submitted successfully:", response);
    // return responseData;
  }

  async delete(relatorioId: string): Promise<void> {
    const result = await fetch(`${this.url}/${relatorioId}`, {
      method: "DELETE",
    });
    const responseData = await result.text();
    console.log("🚀 ~ file: RelatorioAPI.ts:118 ~ responseData:", responseData);
    // return responseData;
  }
}
