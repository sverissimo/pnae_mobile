import { StyleSheet, Text, View } from "react-native";
import React from "react";

type RowProps = {
  data?: any;
  isHeader?: boolean;
  columns?: any;
};

export const ListItem: React.FC<RowProps> = ({ data, isHeader, columns }) => {
  return (
    <View style={isHeader ? styles.headerContainer : styles.itemContainer}>
      {columns.map((column: any) => (
        <Text
          key={column.key}
          style={isHeader ? styles.headerText : styles.itemText}
        >
          {isHeader ? column.label : data?.[column.key]}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  itemText: {
    textAlign: "center",
    flex: 1,
  },
});

/* const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  item: {
    marginHorizontal: 5,
  },
});
 */
