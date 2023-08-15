import { StyleSheet, Text, View } from "react-native";
import React from "react";

export const ListTitle = ({ title }: { title: string | undefined }) => {
  return <Text style={styles.title}>{title} </Text>;
};

const styles = StyleSheet.create({
  title: {
    marginTop: "2%",
    marginBottom: "3%",
    fontWeight: "500",
    fontSize: 16,
  },
});
