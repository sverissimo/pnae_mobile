import humps from "humps";
import { RelatorioLocalDTO } from "@infrastructure/database/dto";
import { Usuario } from "@shared/types";
import { RelatorioModel } from "../types";
import { UsuarioService } from "@services/UsuarioService";

export class Relatorio {
  constructor(private relatorio: RelatorioModel) {}

  toLocalDTO(): RelatorioLocalDTO {
    const relatorioDTO = this.toDTO();
    const relatorioLocalDTO = this.decamelizeRelatorio(relatorioDTO);
    return relatorioLocalDTO;
  }

  toDTO(): any {
    const {
      numeroRelatorio,
      nomeTecnico,
      outroExtensionista,
      nomeOutroExtensionista,
      matriculaOutroExtensionista,
      ...rest
    } = this.relatorio;

    const relatorioDTO: any = rest;
    if (numeroRelatorio) {
      relatorioDTO.numeroRelatorio = +numeroRelatorio;
    }

    relatorioDTO.outroExtensionista = outroExtensionista
      ?.map((e) => e.id_usuario)
      .join(",");
    return relatorioDTO;
  }

  static toModel(relatorioDTO: RelatorioLocalDTO): RelatorioModel {
    const relatorio = Relatorio.camelizeRelatorio(relatorioDTO);
    return relatorio;
  }

  addTecnicos = (tecnicos: Usuario[]) => {
    const { tecnicoId } = this.relatorio;
    const nomeTecnico = UsuarioService.getTecnicoName(tecnicoId, tecnicos);
    const outrosExtensionistasInfo =
      UsuarioService.aggregateOutroExtensionistaInfo(tecnicos, this.relatorio);

    Object.assign(this.relatorio, { ...outrosExtensionistasInfo, nomeTecnico });
    return this.relatorio;
  };

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
    }) as RelatorioModel;
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
