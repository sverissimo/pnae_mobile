import { CreateRelatorioDTO } from "./CreateRelatorioDTO";

export type UpdateRelatorioDTO = Partial<CreateRelatorioDTO> & {
  id: number;
};
