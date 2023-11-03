import { RelatorioDomainService } from "@domain/relatorio/services/RelatorioDomainService";
import { RelatorioModel } from "@features/relatorio/types/RelatorioModel";
import { UsuarioAPI } from "@infrastructure/api/usuario/UsuarioAPI";
import { Usuario } from "@shared/types/Usuario";

export class UsuarioService {
  async fetchTecnicosByRelatorios(relatorios: RelatorioModel[]) {
    const tecnicoIds =
      RelatorioDomainService.getTecnicosIdsFromRelatoriosList(relatorios);

    const tecnicos = await UsuarioAPI.getUsuarios({
      ids: tecnicoIds.join(","),
    });

    return tecnicos as Usuario[];
  }
}
