import { RelatorioModel } from "@features/relatorio/types";
import { FileService } from "@services/files/FileService";

export class TaskManager {
  async removeDanglingFiles(relatorios: RelatorioModel[]) {
    await new FileService().removeDanglingFiles(relatorios);
  }
}
