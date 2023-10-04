import { RelatorioModel } from "@features/relatorio/types";
import { UsuarioAPI } from "@infrastructure/api";
import { Usuario } from "@shared/types";

export const UsuarioService = {
  getTecnicoName,
  aggregateOutroExtensionistaInfo,
  fetchTecnicosByRelatorios,
};

function getTecnicoName(tecnicoId: string, tecnicos: Usuario[]) {
  const tecnico = tecnicos.find((t) => t?.id_usuario == tecnicoId);
  return tecnico?.nome_usuario;
}

async function fetchTecnicosByRelatorios(relatorios: RelatorioModel[]) {
  const tecnicoIds = getTecnicosIdsFromRelatoriosList(relatorios);
  const tecnicos = await UsuarioAPI.getUsuarios({
    ids: tecnicoIds.join(","),
  });
  return tecnicos;
}

function aggregateOutroExtensionistaInfo(
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

function getTecnicosIdsFromRelatoriosList(
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
  console.log("🚀 ~ file: RelatorioService.ts:129 ~ tecnicoIds:", tecnicoIds);
  if (!tecnicoIds.length) return [];
  return tecnicoIds as string[];
}
