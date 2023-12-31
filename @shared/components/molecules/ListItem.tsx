import { StyleSheet, Text, View } from "react-native";
import { globalColors } from "../../constants/themes";
import { Icon } from "../atoms";

type RowProps<T> = {
  data?: T;
  isHeader?: boolean;
  columns: any;
  preventDelete?: boolean;
  onView?: () => void;
  onEdit?: (data: any) => void;
  getPDFLink?: (data: T) => void;
  onDelete?: (entity: T) => void;
};

const { primary, grayscale } = globalColors;

export const ListItem = <T extends { [key: string]: any }>({
  data,
  isHeader,
  columns,
  onView,
  onEdit,
  getPDFLink,
  onDelete,
}: RowProps<T>) => {
  const checkReadOnly = (action: string) => {
    if (data?.readOnly && (action === "edit" || action === "delete")) {
      return true;
    }
    return false;
  };

  return (
    <View
      style={isHeader ? styles.headerContainer : { ...styles.itemContainer }}
    >
      {columns.map((column: any) =>
        !column.icons || isHeader ? (
          <Text
            key={column.key}
            style={
              isHeader
                ? { ...styles.headerText, ...column.styles }
                : { ...styles.itemText, ...column.styles }
            }
          >
            {isHeader ? column.label : (data![column.key] as T)}
          </Text>
        ) : (
          <View
            style={{ ...styles.iconContainer, ...column.styles }}
            key={column.key}
          >
            {column.icons.map(({ iconName, action, color }: any) => (
              <Icon
                key={iconName}
                // disabled={checkReadOnly(action)}
                disabled={
                  checkReadOnly(action) ||
                  (data?.preventDelete && action === "delete")
                }
                iconName={iconName}
                size={16}
                color={
                  checkReadOnly(action) ||
                  (data?.preventDelete && action === "delete")
                    ? grayscale[300]
                    : color || primary[600]
                }
                onPress={
                  action === "view" && onView
                    ? () => onView()
                    : action === "getPDF" && getPDFLink
                    ? () => getPDFLink(data!)
                    : action === "edit" && onEdit
                    ? () => onEdit(data)
                    : action === "delete" && onDelete
                    ? () => onDelete(data!)
                    : () => console.log("no action available")
                }
              />
            ))}
          </View>
        )
      )}
    </View>
  );
};
// const bgColor = grayscale[200];
const bgColor = primary[50];
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
    fontSize: 11,
    borderColor: bgColor,
    borderWidth: 0.3,
    backgroundColor: "white",
    paddingVertical: "1%",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
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
