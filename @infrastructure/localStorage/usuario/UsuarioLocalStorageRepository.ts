import { Repository } from "@domain/Repository";
import { LocalStorageRepository } from "../LocalStorageRepository";
import { Usuario } from "@shared/types";

export class UsuarioLocalStorageRepository
  extends LocalStorageRepository
  implements Repository<Usuario>
{
  protected collection = "usuarios";
  protected key = "id_usuario";

  async create(usuario: Usuario): Promise<void> {
    const { id_usuario } = usuario;

    await this.saveData(id_usuario, usuario);
    console.log("@@@@ UsuarioLocalStorageRepository created usuario.");
  }

  async findMany(ids: string[]): Promise<Usuario[]> {
    const usuarios = await super.findMany(ids);
    return usuarios as Usuario[];
  }

  async update(usuario: Partial<Usuario>) {
    throw new Error("Method not implemented.");
  }
}
