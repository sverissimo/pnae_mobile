import humps from "humps";

import { getRelatoriosFromDB } from "../@infrastructure/database/RelatorioDB";
import { ProdutorAPI } from "../@infrastructure/api/ProdutorAPI_renamed";

export const ProdutorService = {
  getProdutor: async (CPFProdutor: string) => {
    const produtor = await ProdutorAPI.getProdutor(CPFProdutor);

    const relatorios = await getRelatoriosFromDB(produtor?.id_pessoa_demeter);
    produtor.relatorios = humps.camelizeKeys(relatorios);
    return produtor;
  },
};
