import humps from "humps";
import { RelatorioRepository } from "@domain/relatorio/repository/RelatorioRepository";
import { RelatorioModel } from "@features/relatorio/types";
import { ExpoSQLiteRepository } from "@infrastructure/database/ExpoSQLiteRepository";
import { db } from "@infrastructure/database/config";
import { RelatorioLocalDTO } from "../dto/RelatorioLocalDTO";

export class RelatorioExpoSQLRepository
  extends ExpoSQLiteRepository<RelatorioModel>
  implements RelatorioRepository
{
  constructor(tableName = "relatorio", primaryKey = "id", database: any = db) {
    super(tableName, primaryKey, database);
  }

  async create(relatorio: RelatorioModel): Promise<void> {
    const relatorioLocalDTO = this.toLocalDTO(relatorio);
    await this.db.create(relatorioLocalDTO);
  }

  async findByProdutorID(produtorId: string): Promise<RelatorioModel[]> {
    const query = "SELECT * FROM relatorio WHERE produtor_id = ?;";
    const values = [produtorId];
    const result = (await this.db.find(query, values)) as RelatorioLocalDTO[];

    const relatorios = result.map(this.camelizeRelatorio);
    return relatorios;
  }

  async findAll(): Promise<RelatorioModel[]> {
    const relatorioDTOs = (await this.db.find()) as RelatorioLocalDTO[];
    const relatorios = relatorioDTOs.map(this.camelizeRelatorio);
    return relatorios;
  }

  async update(relatorio: Partial<RelatorioModel>): Promise<void> {
    const updates = this.toLocalDTO(relatorio);
    await this.db.update(updates);
    return;
  }

  async delete(relatorioId: string) {
    await this.db.delete(relatorioId);
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
