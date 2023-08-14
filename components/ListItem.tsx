import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { globalColors } from "../constants/themes";

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
const bgColor = globalColors.grayscale[200];
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    backgroundColor: bgColor,
  },
  headerText: {
    flex: 1,
    fontSize: 13,
    textAlign: "center",
    fontFamily: "Roboto",
    //color: "white",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: bgColor,
    borderWidth: 0.3,
  },
  itemText: {
    textAlign: "center",
    flex: 1,
    fontSize: 12,
    borderColor: bgColor,
    borderWidth: 0.3,
    backgroundColor: "white",
    paddingVertical: "1%",
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
