import { SQLResultSet } from "expo-sqlite";

import { RelatorioModel } from "@features/relatorio/types";
import humps from "humps";

import { SQLiteRepository } from "@infrastructure/database/SQLiteRepository";
import { RelatorioLocalDTO } from "../dto/RelatorioLocalDTO";
import { RelatorioRepository } from "@domain/relatorio/repository/RelatorioRepository";

export class RelatorioSQLiteRepository
  extends SQLiteRepository<RelatorioLocalDTO>
  implements RelatorioRepository
{
  async create(relatorio: RelatorioModel): Promise<void> {
    const relatorioLocalDTO = this.toLocalDTO(relatorio);
    const { queryString, values } = this.createSQLQuery(relatorioLocalDTO);
    await this.executeSqlCommand(queryString, values);
  }

  async findByProdutorID(produtorId: string): Promise<RelatorioModel[]> {
    const { queryString, values } = this.findSQLQuery(
      produtorId,
      "produtor_id"
    );
    const result = (await this.executeSqlQuery(
      queryString,
      values
    )) as RelatorioLocalDTO[];

    const relatorios = result.map(this.camelizeRelatorio);
    relatorios.forEach((r) => (r.readOnly = Boolean(r.readOnly)));

    return relatorios;
  }
  async findById(id: string): Promise<RelatorioModel | null> {
    const { queryString, values } = this.findSQLQuery(id);
    const result = (await this.executeSqlQuery(
      queryString,
      values
    )) as RelatorioLocalDTO[];
    if (result.length === 0) {
      return null;
    }
    const relatorio = this.camelizeRelatorio(result[0]);
    relatorio.readOnly = Boolean(relatorio.readOnly);
    return relatorio;
  }

  async findAll(): Promise<RelatorioModel[]> {
    const relatorioDTOs = (await this.db.find()) as RelatorioLocalDTO[];
    const relatorios = relatorioDTOs.map(this.camelizeRelatorio);
    return relatorios;
  }

  async update(relatorio: Partial<RelatorioModel>): Promise<void> {
    const updates = this.toLocalDTO(relatorio);
    const { queryString, values } = this.updateSQLQuery(updates);
    await this.executeSqlCommand(queryString, values);
    return;
  }

  async delete(relatorioId: string) {
    const { queryString, values } = this.deleteSQLQuery(relatorioId);
    await this.executeSqlCommand(queryString, values);
  }

  executeSqlQuery = (
    query: string,
    values: any[]
  ): Promise<RelatorioLocalDTO[]> => {
    return this.db.all(query, values);
  };

  executeSqlCommand = (query: string, values: any[]): Promise<SQLResultSet> => {
    return this.db.run(query, values);
  };

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
