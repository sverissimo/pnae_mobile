import { StyleSheet, Text, View } from "react-native";
import { globalColors } from "../../../constants/themes";
import { Icon } from "../atoms";

type RowProps = {
  data?: any;
  isHeader?: boolean;
  columns?: any;
  onPress?: any;
  onEdit?: (data: any) => void;
};

export const ListItem: React.FC<RowProps> = ({
  data,
  isHeader,
  columns,
  onEdit,
  onPress,
}) => {
  return (
    <View style={isHeader ? styles.headerContainer : styles.itemContainer}>
      {columns.map((column: any) =>
        !column.icon || isHeader ? (
          <Text
            key={column.key}
            style={isHeader ? styles.headerText : styles.itemText}
          >
            {isHeader ? column.label : data?.[column.key]}
          </Text>
        ) : (
          <View style={styles.iconContainer} key={column.key}>
            <Icon
              iconName="pencil"
              size={16}
              color={globalColors.primary[500]}
              onPress={
                column.key === "edit" && onEdit
                  ? () => onEdit(data)
                  : () => console.log("fkkkkkkkkkkkkkkkkkk")
              }
            />
          </View>
        )
      )}
    </View>
  );
};
// const bgColor = globalColors.grayscale[200];
const bgColor = globalColors.primary[100];
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
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",

    flex: 1,
    fontSize: 12,
    borderColor: bgColor,
    borderWidth: 0.3,
    backgroundColor: "white",
    paddingVertical: "1%",
    //padding: "2%",
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
