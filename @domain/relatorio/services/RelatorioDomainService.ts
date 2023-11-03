import { RelatorioModel } from "@features/relatorio/types";
import { Usuario } from "@shared/types";

export class RelatorioDomainService {
  static mergeRelatorios(
    relatorios: RelatorioModel[],
    relatoriosFromServer: RelatorioModel[]
  ) {
    const relatoriosFromLocalDB = relatorios.map((relatorio) => {
      const serverRel = relatoriosFromServer.find(
        (r: RelatorioModel) => r.id === relatorio.id
      );
      const readOnly = serverRel?.readOnly || false;
      return { ...relatorio, readOnly };
    });

    const relatorioMap = new Map<string, RelatorioModel>();
    const updateMap = (relatorio: RelatorioModel) => {
      const existing = relatorioMap.get(relatorio.id);
      if (
        !existing ||
        new Date(relatorio.updatedAt) > new Date(existing.updatedAt)
      ) {
        relatorioMap.set(relatorio.id, relatorio);
      }
    };

    [...relatoriosFromLocalDB, ...relatoriosFromServer].forEach(updateMap);
    const updatedRelatorios = Array.from(relatorioMap.values());
    return updatedRelatorios;
  }

  getOutrosExtensionistasNames = (relatorio: RelatorioModel) => {
    const outroExtensionista = relatorio.outroExtensionista || [];
    const nomes = outroExtensionista.map((e) => e.nome_usuario);
    return nomes?.join(", ");
  };

  getOutrosExtensionistasMatriculas = (relatorio: RelatorioModel) => {
    const outroExtensionista = relatorio.outroExtensionista || [];
    const matriculas = outroExtensionista.map((e) => e.matricula_usuario);
    return matriculas?.join(", ");
  };

  static getOutrosExtensionistasIds = (relatorio: Partial<RelatorioModel>) => {
    const outroExtensionista = relatorio.outroExtensionista || [];
    const ids = outroExtensionista?.map((e) => e.id_usuario).join(",") || "";
    return ids;
  };

  static addTecnicos = (tecnicos: Usuario[], relatorio: RelatorioModel) => {
    const { tecnicoId } = relatorio;
    const usuario = tecnicos.find((t) => t?.id_usuario == tecnicoId);
    const outrosExtensionistasInfo =
      RelatorioDomainService.aggregateOutroExtensionistaInfo(
        tecnicos,
        relatorio
      );

    return {
      ...relatorio,
      ...outrosExtensionistasInfo,
      nomeTecnico: usuario?.nome_usuario,
    } as RelatorioModel;
  };

  static getTecnicosIdsFromRelatoriosList(
    relatoriosList: RelatorioModel[]
  ): string[] {
    const tecnicoIds = [
      ...new Set(
        relatoriosList
          // .map((r: Relatorio) => r?.tecnicoId?.toString())
          .reduce((acc: any, r: RelatorioModel) => {
            acc.push(r?.tecnicoId?.toString());
            acc.push(r?.outroExtensionista?.toString());
            return acc;
          }, [])
          .filter((id: string) => !!id)
      ),
    ];

    if (!tecnicoIds.length) return [];
    return tecnicoIds as string[];
  }

  static aggregateOutroExtensionistaInfo(
    tecnicos: Usuario[],
    relatorio: RelatorioModel
  ) {
    const outroExtensionista = tecnicos.filter(
      (t) =>
        relatorio?.outroExtensionista &&
        relatorio.outroExtensionista.toString().match(t.id_usuario)
    );

    const { nomeOutroExtensionista, matriculaOutroExtensionista } =
      outroExtensionista.reduce(
        (acc, tecnico) => {
          acc.nomeOutroExtensionista += `${tecnico.nome_usuario},`;
          acc.matriculaOutroExtensionista += `${tecnico.matricula_usuario},`;
          return acc;
        },
        { nomeOutroExtensionista: "", matriculaOutroExtensionista: "" }
      );

    return {
      nomeOutroExtensionista,
      matriculaOutroExtensionista,
      outroExtensionista,
    };
  }
}
