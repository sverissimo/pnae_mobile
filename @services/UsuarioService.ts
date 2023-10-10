import { RelatorioDomainService } from "@domain/relatorio/services";
import { RelatorioModel } from "@features/relatorio/types";
import { UsuarioAPI } from "@infrastructure/api/UsuarioAPI";
import { Usuario } from "@shared/types";

export const UsuarioService = {
  fetchTecnicosByRelatorios,
};

async function fetchTecnicosByRelatorios(relatorios: RelatorioModel[]) {
  const tecnicoIds =
    RelatorioDomainService.getTecnicosIdsFromRelatoriosList(relatorios);

  const tecnicos = await UsuarioAPI.getUsuarios({
    ids: tecnicoIds.join(","),
  });

  return tecnicos as Usuario[];
}
