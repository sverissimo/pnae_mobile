import { Relatorio } from "features/relatorio/types/Relatorio";

type ParamListBase = {
  [key: string]: object | undefined;
};

export type RouteParamsList = {
  params: {
    perfil: any;
    signatureCaptureHandler?: (
      field: string,
      assinaturaURI: string
    ) => Promise<void>;
  };
};

export type RootStackParamList = ParamListBase & {
  HomeScreen: undefined;
  ProdutorScreen: { title: string } | undefined;
  RelatorioScreen: undefined;
  PerfilScreen: undefined;
  PropriedadeScreen: undefined;
  CreateRelatorioScreen: { relatorios: Relatorio[] | undefined };
  EditRelatorioScreen: { relatorioId: string | number };
  CreatePerfilScreen: undefined;
  EditPerfilScreen: { perfil: any };
  tabs: undefined;
  GetSignature: RouteParamsList;
  // GetSignatureScreen: { signatureCaptureHandler: (signature: any) => void };
};
