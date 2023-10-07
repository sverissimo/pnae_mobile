import humps from "humps";
import { RelatorioLocalDTO } from "@infrastructure/database/dto";
import { Usuario } from "@shared/types";
import { RelatorioModel } from "@features/relatorio/types";
import { UsuarioService } from "@services/UsuarioService";
import { RelatorioBackendDTO } from "@infrastructure/api/relatorio/dto";

export class Relatorio {
  constructor(private readonly relatorio: RelatorioModel) {
    this.relatorio = relatorio;
    this.relatorio.numeroRelatorio = +relatorio.numeroRelatorio;
    this.validate();
  }

  private validate() {
    const { produtorId, tecnicoId, numeroRelatorio } = this.relatorio;
    if (!produtorId) {
      throw new Error("Produtor não pode ser vazio");
    }
    if (!tecnicoId) {
      throw new Error("Técnico não pode ser vazio");
    }
    if (
      isNaN(numeroRelatorio) ||
      0 >= numeroRelatorio ||
      numeroRelatorio > 999
    ) {
      throw new Error("Número do relatório inválido");
    }
  }

  AddOutrosExtensionistas = (outroExtensionista: Usuario[]) => {
    this.relatorio.outroExtensionista = outroExtensionista;
  };

  getOutrosExtensionistasNames = () => {
    const { outroExtensionista } = this.relatorio ?? {};
    const nomes = outroExtensionista?.map((e) => e.nome_usuario);
    return nomes?.join(", ");
  };

  getOutrosExtensionistasMatriculas = () => {
    const { outroExtensionista } = this.relatorio ?? {};
    const matriculas = outroExtensionista?.map((e) => e.matricula_usuario);
    return matriculas?.join(", ");
  };

  getOutrosExtensionistasIds = () => {
    const { outroExtensionista } = this.relatorio ?? {};
    const ids = outroExtensionista?.map((e) => e.id_usuario);
    return ids?.join(",");
  };

  toLocalDTO(): RelatorioLocalDTO {
    const relatorioDTO = this.toDTO();
    const relatorioLocalDTO = this.decamelizeRelatorio(relatorioDTO);
    return relatorioLocalDTO;
  }

  toDTO(): RelatorioBackendDTO {
    const {
      numeroRelatorio,
      nomeTecnico,
      outroExtensionista,
      nomeOutroExtensionista,
      matriculaOutroExtensionista,
      ...rest
    } = this.relatorio;

    const relatorioDTO = rest as RelatorioBackendDTO;

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

    return {
      ...this.relatorio,
      ...outrosExtensionistasInfo,
      nomeTecnico,
    } as RelatorioModel;
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

  private decamelizeRelatorio(relatorio: RelatorioBackendDTO) {
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
