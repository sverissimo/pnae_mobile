import { Usuario } from "@shared/types";
import { RelatorioModel } from "@features/relatorio/types";
import { getUpdatedProps } from "@shared/utils";

export class Relatorio {
  constructor(private readonly relatorio: RelatorioModel) {
    this.relatorio = relatorio;
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

  getUpdate = (originalRelatorio: RelatorioModel): Partial<RelatorioModel> => {
    const { createdAt, ...rest } = this.relatorio;
    const update = getUpdatedProps(originalRelatorio, rest);

    const id = update.id || originalRelatorio.id || "";
    const updatedAt = new Date().toISOString();

    return { ...update, id, updatedAt };
  };

  AddOutrosExtensionistas = (outroExtensionista: Usuario[]) => {
    this.relatorio.outroExtensionista = outroExtensionista;
  };

  toModel() {
    return this.relatorio;
  }
}
