import { View, StyleSheet } from "react-native";
import React from "react";
import { ProdutorInfo } from "../features/produtor/components/ProdutorInfo";
import { HomeScreen } from "../screens/HomeScreen";
import { PerfilScreen } from "../screens/PerfilScreen";
import { RelatorioScreen } from "../screens/RelatorioScreen";

type WrapperProps = { children: React.ReactNode };
export const ProdutorSelectWraper = ({ children }: WrapperProps) => {
  return (
    <View style={styles.container}>
      <ProdutorInfo />
      <View style={styles.children}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  children: {},
});

export const HomeWrapped = () => (
  <ProdutorSelectWraper>
    <HomeScreen />
  </ProdutorSelectWraper>
);

export const PerfilWrapped = () => (
  <ProdutorSelectWraper>
    <PerfilScreen />
  </ProdutorSelectWraper>
);

export const RelatorioWrapped = () => (
  <ProdutorSelectWraper>
    <RelatorioScreen />
  </ProdutorSelectWraper>
);
