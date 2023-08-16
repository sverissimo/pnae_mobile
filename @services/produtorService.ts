import humps from "humps";
import { getProdutorData } from "../@infrastructure/api/produtorAPI";
import { getRelatoriosFromDB } from "../@infrastructure/database/dao/relatorioDAO";

export async function getProdutor(CPFProdutor: string) {
  const produtor = await getProdutorData(CPFProdutor);

  const relatorios = await getRelatoriosFromDB(produtor?.id_pessoa_demeter);
  produtor.relatorios = humps.camelizeKeys(relatorios);
  return produtor;
}
