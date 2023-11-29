import { API } from "@infrastructure/api/API";
import { env } from "@config/env";
import { RelatorioRepository } from "@domain/relatorio/repository/RelatorioRepository";
import { RelatorioDomainService } from "@domain/relatorio/services/RelatorioDomainService";
import { RelatorioBackendDTO } from "../dto";
import { RelatorioModel } from "@features/relatorio/types";
import { parseURI } from "@shared/utils/parseURI";
import { log } from "@shared/utils/log";
import { fileExists } from "@shared/utils/fileSystemUtils";
import { CheckForUpdatesResponse } from "@sync/types/CheckForUpdatesResponse";

export class RelatorioAPIRepository implements RelatorioRepository {
  private api = new API<RelatorioModel>();
  private url = `${env.SERVER_URL}/relatorios`;

  async create(relatorio: RelatorioModel): Promise<void> {
    if (!relatorio) throw new Error("Relatorio não pode ser vazio");
    try {
      const relatorioDTO = this.toDTO(relatorio);
      const relatorioWithFileChecks = await this.getUpdatedDTOWithFileChecks(
        relatorioDTO
      );

      const formData = await this.createFormData(relatorioWithFileChecks);
      const response = await this.api.postFormData(this.url, formData);

      console.log("Form data submitted successfully:", response);
    } catch (error) {
      console.error("RelatorioAPI.ts:49 - error submitting form data: ", error);
      throw error;
    }
  }

  async createMany(relatorios: RelatorioModel[]): Promise<void> {
    const syncResult = await Promise.allSettled(
      relatorios.map((r) => this.create(r))
    );

    console.log("🚀 RelAPIRepository - createMany 54 syncResult:", syncResult);
  }

  async findByProdutorId(produtorId: string) {
    const result = await this.api.get(`${this.url}?produtorId=${produtorId}`);
    return result as RelatorioModel[];
  }

  async findAll() {
    const result = await this.api.get(`${this.url}/all`);
    return result as RelatorioModel[];
  }

  async update(relatorioInput: Partial<RelatorioModel>): Promise<void> {
    const relatorio = this.toDTO(relatorioInput);
    const relatorioWithFileChecks = await this.getUpdatedDTOWithFileChecks(
      relatorio
    );
    const { id, ...relatorioDTO } = relatorioWithFileChecks;

    const formData = await this.createFormData(relatorioDTO);

    const response = await this.api.patchFormData(
      `${this.url}/${id}`,
      formData
    );
    console.log("Form data submitted successfully:", response);
  }

  async updateMany(relatorios: RelatorioModel[]): Promise<void> {
    for (const relatorio of relatorios) {
      await this.update(relatorio);
    }
  }

  async delete(relatorioId: string): Promise<void> {
    const result = await fetch(`${this.url}/${relatorioId}`, {
      method: "DELETE",
    });
    const responseData = await result.text();
    console.log("🚀 ~ file: RelatorioAPI.ts:118 ~ responseData:", responseData);
  }

  async getSyncInfo(url: string, body: any) {
    const result = await this.api.getSyncInfo(url, body);
    return result as CheckForUpdatesResponse<RelatorioModel>;
  }

  private async createFormData(
    relatorio: Partial<RelatorioBackendDTO>
  ): Promise<FormData> {
    const formData: any = new FormData();
    Object.entries(relatorio).forEach(([key, value]) => {
      if (value === undefined) return;
      const isURI = key === "pictureURI" || key === "assinaturaURI";
      if (isURI && !value) return;

      formData.append(key, isURI ? parseURI(value)?.split(".")[0] : value);
    });
    const { pictureURI, assinaturaURI } = relatorio;
    const URIKey = ["foto", "assinatura"];

    [pictureURI, assinaturaURI].forEach((uri, i) => {
      if (uri) {
        formData.append(URIKey[i], {
          uri,
          name: parseURI(uri),
          type: URIKey[i] === "foto" ? "image/jpeg" : "image/png",
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
      readOnly,
      ...rest
    } = relatorio;

    const relatorioDTO = rest as RelatorioBackendDTO;

    if (outroExtensionista !== undefined) {
      relatorioDTO.outroExtensionista =
        RelatorioDomainService.getOutrosExtensionistasIds(relatorio);
    }

    return {
      ...relatorioDTO,
      readOnly: !!readOnly,
      updatedAt: relatorio?.updatedAt || undefined,
    };
  }

  private async getUpdatedDTOWithFileChecks(
    relatorioDTO: RelatorioBackendDTO
  ): Promise<RelatorioBackendDTO> {
    const [{ exists: assinaturaExists }, { exists: pictureExists }] =
      await Promise.all([
        fileExists(relatorioDTO.assinaturaURI),
        fileExists(relatorioDTO.pictureURI),
      ]);
    console.log({ assinaturaExists, pictureExists });
    return {
      ...relatorioDTO,
      assinaturaURI: assinaturaExists ? relatorioDTO.assinaturaURI : "",
      pictureURI: pictureExists ? relatorioDTO.pictureURI : "",
    };
  }
}
