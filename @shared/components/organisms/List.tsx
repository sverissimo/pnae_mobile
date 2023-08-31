import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { ListItem } from "../molecules";

type ListProps<T> = {
  data: any[];
  columns?: any;
  onPress?: any;
  onEdit?: (id: number | string) => void;
  getPDFLink?: (id: number | string) => void;
  onDelete?: (entity: T) => void;
};

export const List = <T extends Object>({
  data,
  columns,
  onPress,
  onEdit,
  getPDFLink,
  onDelete,
}: ListProps<T>) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <ListItem isHeader columns={columns} />
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <ListItem
              data={item}
              columns={columns}
              onEdit={() => onEdit && onEdit(item.id)}
              getPDFLink={() => getPDFLink && getPDFLink(item.id)}
              onDelete={onDelete}
            />
          )}
          keyExtractor={(item) => item.id || item.assunto}
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
  },
});
