import { Perfil } from "@features/perfil/types/Perfil";
import { Relatorio } from "features/relatorio/types/Relatorio";

type ParamListBase = {
  [key: string]: object | undefined;
};

export type RouteParamsList = {
  params: {
    parentRoute: string;
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
  ViewPerfilScreen: { perfil: Perfil };
  tabs: undefined;
  GetSignature: RouteParamsList;
  OrientacaoScreen: undefined;
  // GetSignatureScreen: { signatureCaptureHandler: (signature: any) => void };
};
