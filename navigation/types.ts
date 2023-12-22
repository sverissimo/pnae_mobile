import { PerfilModel } from "@domain/perfil";
import { RelatorioModel } from "@features/relatorio/types";

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
  CreateRelatorioScreen: { relatorios: RelatorioModel[] | undefined };
  EditRelatorioScreen: { relatorioId: string | number };
  CreatePerfilScreen: { key: string; selectedOptions: string[] } | undefined;
  EditPerfilScreen: { perfil: any };
  ViewPerfilScreen: { perfil: PerfilModel; municipio: string };
  tabs: undefined;
  GetSignature: RouteParamsList;
  OrientacaoScreen: undefined;
  // GetSignatureScreen: { signatureCaptureHandler: (signature: any) => void };
};
