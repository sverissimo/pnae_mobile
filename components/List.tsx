import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ListItem } from "./ListItem";

type ListProps = {
  data?: any;
  title?: string;
  columns?: any;
};

export const List = ({ title, data, columns }: ListProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>{title} </Text>
      <ListItem isHeader columns={columns} />
      <FlatList
        data={data}
        renderItem={({ item }) => <ListItem data={item} columns={columns} />}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: "100%",
  },
});
