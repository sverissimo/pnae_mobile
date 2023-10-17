import { API } from "@infrastructure/api/API";
import { env } from "@config/env";
import { parseURI } from "@shared/utils/parseURI";
import { RelatorioRepository } from "@domain/relatorio/repository/RelatorioRepository";
import { RelatorioDomainService } from "@domain/relatorio/services/RelatorioDomainService";
import { RelatorioBackendDTO } from "../dto";
import { RelatorioModel } from "@features/relatorio/types";

export class RelatorioAPI implements RelatorioRepository {
  private api = new API();
  private url = `${env.SERVER_URL}/relatorios`;

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

  async findAll(): Promise<RelatorioModel[]> {
    const result = await this.api.get(`${this.url}/all`);
    return result;
  }

  async update(relatorioInput: Partial<RelatorioModel>): Promise<void> {
    const relatorio = this.toDTO(relatorioInput);
    const { id, ...relatorioDTO } = relatorio;
    console.log(
      "🚀 ~ file: RelatorioAPI.ts:34 ~ RelatorioAPI ~ update ~ relatorioDTO:",
      relatorioDTO
    );
    const formData = await this.createFormData(relatorioDTO);

    const response = await this.api.patch(`${this.url}/${id}`, formData);
    console.log("Form data submitted successfully:", response);
  }

  async delete(relatorioId: string): Promise<void> {
    const result = await fetch(`${this.url}/${relatorioId}`, {
      method: "DELETE",
    });
    const responseData = await result.text();
    console.log("🚀 ~ file: RelatorioAPI.ts:118 ~ responseData:", responseData);
  }

  private async createFormData(
    relatorio: Partial<RelatorioBackendDTO>
  ): Promise<FormData> {
    const formData: any = new FormData();
    Object.entries(relatorio).forEach(([key, value]) => {
      const isURI = key === "pictureURI" || key === "assinaturaURI";
      formData.append(key, isURI ? parseURI(value)?.split(".")[0] : value);
    });
    const { pictureURI, assinaturaURI } = relatorio;
    const URIKey = ["foto", "assinatura"];

    [pictureURI, assinaturaURI].forEach((uri, i) => {
      if (uri) {
        formData.append(URIKey[i], {
          uri,
          name: parseURI(uri),
          type: "image/png",
        });
      }
    });
    return formData;
  }

  private toDTO(relatorio: Partial<RelatorioModel>): RelatorioBackendDTO {
    const {
      nomeTecnico,
      outroExtensionista,
      nomeOutroExtensionista,
      matriculaOutroExtensionista,
      ...rest
    } = relatorio;

    const relatorioDTO = rest as RelatorioBackendDTO;

    relatorioDTO.outroExtensionista =
      RelatorioDomainService.getOutrosExtensionistasIds(
        relatorio as Partial<RelatorioModel>
      );

    return relatorioDTO;
  }
}
