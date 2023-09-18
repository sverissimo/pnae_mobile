import { ProdutorAPI } from "../@infrastructure/api/ProdutorAPI";

export const ProdutorService = {
  getProdutor: async (CPFProdutor: string) => {
    const produtor = await ProdutorAPI.getProdutor(CPFProdutor);
    return produtor;
  },
};
