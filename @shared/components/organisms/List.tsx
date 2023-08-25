import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { ListItem } from "../molecules";

type ListProps = {
  data?: any;
  columns?: any;
  onPress?: any;
};

export const List = ({ data, columns, onPress }: ListProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <ListItem isHeader columns={columns} />
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <ListItem data={item} columns={columns} onPress={onPress} />
          )}
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
  },
});
