import { ProdutorModel } from "@domain/produtor/ProdutorModel";

/* Key is the cpfProdutor */
export type ProdutorLocalStorageDTO = {
  [key: string]: ProdutorModel;
};
