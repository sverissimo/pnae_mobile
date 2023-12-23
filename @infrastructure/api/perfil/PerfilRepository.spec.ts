import { PerfilAPIRepository } from "./PerfilAPIRepository"; // Replace with the actual import path
// import { producaoNaturaForm, producaoIndustrialForm } from './forms'; // Replace with the actual import path
import { primeNumbersArray } from "./constants/primeNumbersArray";
import perfilOptions from "_mockData/perfil/perfilOptions.json";
import perfilInputDTO from "_mockData/perfil/perfilInput.json";
import perfilInput from "_mockData/perfil/perfil.json";

describe("PerfilAPIRepository", () => {
  let perfilAPIRepository: PerfilAPIRepository;
  const perfil = { ...perfilInput, ...perfilInputDTO };

  beforeEach(() => {
    perfilAPIRepository = new PerfilAPIRepository();
    // perfilInputDTO = {
    //   // minimal representation of perfil data needed for testing
    //   atividades_com_regularizacao_ambiental: ["Fruticultura", "Cereais e Grãos"],
    //   atividades_usam_recursos_hidricos: ["Irrigação de culturas"],
    //   condicao_posse: ["Parceiro/Meeiro"],
    //   // ... other properties
    // };
  });

  it.only("getPrimeNumbersProps should calculate the correct product of prime numbers for selected options", () => {
    const result = perfilAPIRepository.getPrimeNumbersProps(
      perfil,
      perfilOptions
    );
    // console.log(
    //   "🚀 - file: PerfilRepository.spec.ts:28 - it.only - result:",
    //   result
    // );

    const expectedAtividadesComRegularizacaoAmbiental =
      primeNumbersArray[2] * primeNumbersArray[1];

    const expectedProcedimentoPosColheita = 11 * 13;
    primeNumbersArray[2] * primeNumbersArray[1];

    const expectedAtividadesUsamRecursosHidricos = primeNumbersArray[2];
    const expectedCondicaoPosse = primeNumbersArray[3];

    const expectedDificuldadeFornecimentoNatura = 17;

    expect(result.atividades_com_regularizacao_ambiental).toBe(
      String(expectedAtividadesComRegularizacaoAmbiental)
    );
    expect(result.atividades_usam_recursos_hidricos).toBe(
      String(expectedAtividadesUsamRecursosHidricos)
    );
    expect(result.condicao_posse).toBe(String(expectedCondicaoPosse));
    expect(result.procedimento_pos_colheita).toBe(
      String(expectedProcedimentoPosColheita)
    );
    expect(result.dados_producao_in_natura.dificuldade_fornecimento).toBe(
      String(expectedDificuldadeFornecimentoNatura)
    );
  });

  // Add more tests to cover additional scenarios, edge cases, or error handling
});
