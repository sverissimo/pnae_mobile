import humps from "humps";
import { SQL_DAO } from "@infrastructure/database/SQL_DAO";
import { RelatorioRepository } from "@domain/relatorio/repository/RelatorioRepository";
import { RelatorioModel } from "@features/relatorio/types";
import { RelatorioLocalDTO } from "../dto/RelatorioLocalDTO";

export class RelatorioRepositoryImpl implements RelatorioRepository {
  constructor(private relatorioDAO: SQL_DAO<RelatorioLocalDTO>) {}
  async create(relatorio: RelatorioModel): Promise<void> {
    const relatorioLocalDTO = this.toLocalDTO(relatorio);
    await this.relatorioDAO.create(relatorioLocalDTO);
  }

  async findByProdutorID(produtorId: string): Promise<RelatorioModel[]> {
    const result = (await this.relatorioDAO.find(
      produtorId,
      "produtor_id"
    )) as RelatorioLocalDTO[];

    const relatorios = result.map(this.camelizeRelatorio);
    relatorios.forEach((r) => (r.readOnly = Boolean(r.readOnly)));
    return relatorios;
  }

  async findById(id: string): Promise<RelatorioModel | null> {
    const result = (await this.relatorioDAO.find(id)) as RelatorioLocalDTO[];
    if (result.length === 0) {
      return null;
    }
    const relatorio = this.camelizeRelatorio(result[0]);
    relatorio.readOnly = Boolean(relatorio.readOnly);
    return relatorio;
  }

  async findAll(): Promise<RelatorioModel[]> {
    const relatorioDTOs =
      (await this.relatorioDAO.find()) as RelatorioLocalDTO[];
    const relatorios = relatorioDTOs.map(this.camelizeRelatorio);
    return relatorios;
  }

  async update(relatorio: Partial<RelatorioModel>): Promise<void> {
    const updates = this.toLocalDTO(relatorio);
    await this.relatorioDAO.update(updates);
    return;
  }

  async delete(relatorioId: string) {
    await this.relatorioDAO.delete(relatorioId);
  }

  private toLocalDTO(relatorio: Partial<RelatorioModel>): RelatorioLocalDTO {
    const {
      numeroRelatorio,
      nomeTecnico,
      outroExtensionista,
      nomeOutroExtensionista,
      matriculaOutroExtensionista,
      ...rest
    } = relatorio;

    const relatorioLocalDTO = this.decamelizeRelatorio(
      rest
    ) as RelatorioLocalDTO;

    if (numeroRelatorio) {
      relatorioLocalDTO.numero_relatorio = +numeroRelatorio;
    }

    relatorioLocalDTO.outro_extensionista =
      outroExtensionista?.map((e) => e.id_usuario).join(",") || "";

    return relatorioLocalDTO;
  }

  private camelizeRelatorio(relatorioLocalDTO: RelatorioLocalDTO) {
    const relatorio = humps.camelizeKeys(relatorioLocalDTO, {
      process: (key, convert, options) => {
        if (key === "picture_uri") {
          return "pictureURI";
        }
        if (key === "assinatura_uri") {
          return "assinaturaURI";
        }
        return convert(key, options);
      },
    }) as RelatorioModel;
    return relatorio;
  }

  private decamelizeRelatorio(relatorio: Partial<RelatorioModel>) {
    const relatorioDTO = humps.decamelizeKeys(relatorio, {
      process: (key, convert, options) => {
        if (key === "pictureURI") {
          return "picture_uri";
        }
        if (key === "assinaturaURI") {
          return "assinatura_uri";
        }
        return convert(key, options);
      },
    }) as RelatorioLocalDTO;
    return relatorioDTO;
  }
}
