import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { ListItem } from "../molecules";

type ListProps = {
  data?: any;
  columns?: any;
  onPress?: any;
  onEdit?: (id: number | string) => void;
};

export const List = ({ data, columns, onPress, onEdit }: ListProps) => {
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
              onPress={onPress}
              onEdit={() => onEdit && onEdit(item.id)}
            />
          )}
          keyExtractor={(item) => item.id.toString() || item.assunto}
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
