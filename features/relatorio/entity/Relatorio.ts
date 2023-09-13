import humps from "humps";
import { RelatorioLocalDTO } from "@infrastructure/database/dto";
import { Usuario } from "@shared/types";
import { Produtor } from "@features/produtor/types/Produtor";
import { RelatorioModel } from "../types";

export class Relatorio {
  constructor(private relatorio: RelatorioModel) {}

  toLocalDTO(): RelatorioLocalDTO {
    console.log(
      "🚀 ~ file: Relatorio.ts:12 ~ Relatorio ~ toLocalDTO ~ this:",
      this
    );
    const relatorioDTO = this.toDTO();

    const relatorioLocalDTO = this.decamelizeRelatorio(relatorioDTO);
    return relatorioLocalDTO;
  }

  toDTO(): any {
    const {
      numeroRelatorio,
      nomeTecnico,
      produtor,
      outroExtensionista,
      nomeOutroExtensionista,
      matriculaOutroExtensionista,
      ...rest
    } = this.relatorio;

    console.log("🚀 ~ file: Relatorio.ts:27 ~ Relatorio ~ toDTO ~ rest:", rest);

    const relatorioDTO: any = rest;
    if (numeroRelatorio) {
      relatorioDTO.numeroRelatorio = +numeroRelatorio;
    }

    relatorioDTO.outroExtensionista = outroExtensionista
      ?.map((e) => e.id_usuario)
      .join(",");
    return relatorioDTO;
  }

  static toModel(
    relatorioDTO: RelatorioLocalDTO,
    tecnicos: Usuario[] = []
  ): RelatorioModel {
    const relatorio = Relatorio.camelizeRelatorio(relatorioDTO);

    const tecnico = tecnicos.find(
      (t) => t?.id_usuario == relatorioDTO?.tecnico_id
    );

    const outroExtensionista = tecnicos.filter(
      (t) =>
        relatorioDTO?.outro_extensionista &&
        relatorioDTO.outro_extensionista.match(t.id_usuario)
    );
    const { nomeOutroExtensionista, matriculaOutroExtensionista } =
      outroExtensionista.reduce(
        (acc, t) => {
          acc.nomeOutroExtensionista += t.nome_usuario + ",";
          acc.matriculaOutroExtensionista += t.matricula_usuario + ",";
          return acc;
        },
        { nomeOutroExtensionista: "", matriculaOutroExtensionista: "" }
      );

    const nomeTecnico = tecnico!.nome_usuario;
    return {
      ...relatorio,
      nomeTecnico,
      outroExtensionista,
      nomeOutroExtensionista,
      matriculaOutroExtensionista,
    } as RelatorioModel;
  }

  private static camelizeRelatorio(relatorioLocalDTO: RelatorioLocalDTO) {
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
    }) as Relatorio;
    return relatorio;
  }

  private decamelizeRelatorio(relatorio: Relatorio) {
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
