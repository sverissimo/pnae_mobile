import { Usuario } from "@shared/types/Usuario";
import { RelatorioModel } from "@features/relatorio/types/RelatorioModel";
import { getUpdatedProps } from "@shared/utils/getUpdatedProps";
import { parseURI } from "@shared/utils/parseURI";

export class Relatorio {
  constructor(private readonly relatorio: RelatorioModel) {
    this.relatorio = relatorio;
    this.validate();
  }

  private validate() {
    const { produtorId, tecnicoId, contratoId, numeroRelatorio } =
      this.relatorio;
    if (!produtorId) {
      throw new Error("Produtor não pode ser vazio");
    }

    if (!tecnicoId) {
      throw new Error("Técnico não pode ser vazio");
    }

    if (!contratoId) {
      throw new Error("Id do contrato não localizado");
    }

    this.relatorio.contratoId = Number(contratoId);
    Relatorio.parseAndValidateNumeroRelatorio(numeroRelatorio);
  }

  static validateRelatorioUpdateObj(relatorioUpdate: Partial<RelatorioModel>) {
    const { numeroRelatorio } = relatorioUpdate;
    if (numeroRelatorio) {
      relatorioUpdate.numeroRelatorio =
        this.parseAndValidateNumeroRelatorio(numeroRelatorio);
    }
  }

  private static parseAndValidateNumeroRelatorio(
    numeroRelatorio: string | number
  ) {
    numeroRelatorio = +numeroRelatorio;
    if (
      isNaN(numeroRelatorio) ||
      0 >= numeroRelatorio ||
      numeroRelatorio > 999
    ) {
      throw new Error("Número do relatório inválido");
    }
    return numeroRelatorio;
  }

  getUpdatedProps = (
    originalRelatorio: RelatorioModel
  ): Partial<RelatorioModel> => {
    const { createdAt, ...rest } = this.relatorio;

    const specialComparators = {
      numeroRelatorio: (a: string, b: string) => +a === +b,
      pictureURI: (a: string, b: string) => parseURI(a) === parseURI(b),
      assinaturaURI: (a: string, b: string) => parseURI(a) === parseURI(b),
      outroExtensionista: (a: Usuario[], b: Usuario[]) =>
        a.every((obj) => b.some((o) => o.id_usuario === obj.id_usuario)) &&
        b.every((obj) => a.some((o) => o.id_usuario === obj.id_usuario)),
    };

    const update = getUpdatedProps(originalRelatorio, rest, specialComparators);

    const id = update.id || originalRelatorio.id || "";
    const updatedAt = new Date().toISOString();

    if (Object.keys(update).length === 1 && !!update.id)
      throw new Error("Nenhum dado foi alterado");

    return {
      ...update,
      id,
      updatedAt,
    };
  };

  toModel() {
    return this.relatorio;
  }
}
