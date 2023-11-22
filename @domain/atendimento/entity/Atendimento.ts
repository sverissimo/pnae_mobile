import { AtendimentoDTO } from "@infrastructure/api/atendimento/dto/AtendimentoDTO";

export type AtendimentoModel = {
  id_usuario: string;
  id_und_empresa: string;
  id_pessoa_demeter: string;
  id_pl_propriedade: string;
  id_relatorio: string;
};

export class Atendimento {
  private atendimento: AtendimentoModel;

  constructor(atendimento: Omit<AtendimentoModel, "link_pdf">) {
    this.atendimento = {
      ...atendimento,
    };
    this.validate();
  }

  toModel() {
    return this.atendimento;
  }

  toDTO(serverURL: string): AtendimentoDTO {
    const { id_relatorio, ...atendimento } = this.atendimento;
    const link_pdf = this.getPDFLink(serverURL);

    return { ...atendimento, link_pdf };
  }

  private getPDFLink(serverURL: string) {
    const { id_relatorio } = this.atendimento;
    const link_pdf = `${serverURL}/relatorios/pdf/${id_relatorio}`;
    return link_pdf;
  }

  validate() {
    if (!this.atendimento.id_usuario) {
      throw new Error("id_usuario é necessário para a criação do atendimento");
    }
    if (!this.atendimento.id_und_empresa) {
      throw new Error(
        "id_und_empresa é necessário para a criação do atendimento"
      );
    }
    if (!this.atendimento.id_relatorio) {
      throw new Error(
        "id_relatorio é necessário para a criação do atendimento"
      );
    }
    if (!this.atendimento.id_pessoa_demeter) {
      throw new Error(
        "id_pessoa_demeter é necessário para a criação do atendimento"
      );
    }
    if (!this.atendimento.id_pl_propriedade) {
      throw new Error(
        "id_pl_propriedade é necessário para a criação do atendimento"
      );
    }
  }
}
