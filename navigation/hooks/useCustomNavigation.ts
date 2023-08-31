import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "navigation/types";

type StackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useCustomNavigation = () => {
  const navigation = useNavigation<StackNavigationProp>();
  return { navigation };
};
