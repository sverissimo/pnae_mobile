import { RelatorioModel } from "@features/relatorio/types";
import { RelatorioBackendDTO } from "@infrastructure/api/relatorio/dto";
import { Usuario } from "@shared/types";
import { formatDate } from "@shared/utils/formatDate";

export class RelatorioDomainService {
  static getOutrosExtensionistasIds = (relatorio: Partial<RelatorioModel>) => {
    const outroExtensionista = relatorio.outroExtensionista || [];
    if (outroExtensionista && typeof outroExtensionista === "string") {
      return outroExtensionista;
    }

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
          .reduce((acc: any, r: RelatorioModel | RelatorioBackendDTO) => {
            acc.push(r?.tecnicoId?.toString());

            const outrosTecnicos = r.outroExtensionista;

            if (
              typeof outrosTecnicos === "string" &&
              outrosTecnicos.match(",")
            ) {
              const ids = outrosTecnicos.split(",");
              acc.push(...ids);
              return acc;
            }

            acc.push(outrosTecnicos?.toString());
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

  static getDataToUpdateOnServer(
    relatoriosLocal: Partial<RelatorioModel>[],
    outdatedOnServer: Partial<RelatorioModel>[]
  ): Partial<RelatorioModel>[] {
    const toUpdateOnServer = relatoriosLocal
      .filter((r) => outdatedOnServer.some((outdated) => outdated.id === r.id))
      .map((r) => {
        const outdatedRecord = outdatedOnServer.find(
          (outdated) => outdated.id === r.id
        );

        return {
          ...r,
          pictureURI: outdatedRecord?.pictureURI ? r.pictureURI : undefined,
          assinaturaURI: outdatedRecord?.assinaturaURI
            ? r.assinaturaURI
            : undefined,
        };
      });

    return toUpdateOnServer;
  }

  static checkForCreatedToday(relatorios: RelatorioModel[]): boolean {
    const today = new Date();
    const todayString = formatDate(today.toISOString());

    const relatoriosWithSameDate = relatorios.some(
      (relatorio) => formatDate(relatorio.createdAt) === todayString
    );
    return relatoriosWithSameDate;
  }

  static getCreateLimit(
    relatorios: RelatorioModel[],
    tecnicoId: string
  ): boolean {
    const today = new Date();
    const todayString = formatDate(today.toISOString());

    const relatoriosWithSameDate = relatorios.filter(
      (rel) =>
        formatDate(rel.createdAt) === todayString && rel.tecnicoId === tecnicoId
    );

    return relatoriosWithSameDate.length >= 6;
  }
}
