import { StyleSheet, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FormFieldContainer } from "../../../@shared/components/molecules/FormFieldContainer";

// Define the type for the route, assuming 'YourStackName' is the name of your stack
type EditPerfEditPerfilScreenRouteProp = RouteProp<
  { EditPerfilScreen: { perfil: any } },
  "EditPerfilScreen"
>;

export const EditPerfilScreen = () => {
  return <></>;
  const routes = useRoute<EditPerfEditPerfilScreenRouteProp>();
  const { perfil } = routes.params;
  const keys = Object.keys(perfil).filter(
    (key) =>
      typeof perfil[key] === "string" ||
      typeof perfil[key] === "number" ||
      typeof perfil[key] === "boolean"
  );

  return (
    <View>
      {keys.map((key, i) => {
        return (
          <FormFieldContainer key={key} label={key}>
            <Text> {perfil[key].toString()}</Text>
          </FormFieldContainer>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({});
