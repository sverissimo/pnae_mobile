import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ListItem } from "./ListItem";
import { globalColors } from "../constants/themes";

type ListProps = {
  data?: any;
  title?: string;
  columns?: any;
};

export const List = ({ title, data, columns }: ListProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{title} </Text>
      <View style={styles.listContainer}>
        <ListItem isHeader columns={columns} />
        <FlatList
          //style={styles.list}
          data={data}
          renderItem={({ item }) => <ListItem data={item} columns={columns} />}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: "100%",
  },
  listContainer: {
    borderWidth: 0.1,
    borderRadius: 25,
    /*
    color: globalColors.grayscale[200], */
  },
  title: {
    marginTop: "2%",
    marginBottom: "3%",
    fontWeight: "500",
    fontSize: 16,
    //alignSelf: "center",
  },
});
