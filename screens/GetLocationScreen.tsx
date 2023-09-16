import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Button } from "react-native-paper";

type GetLocationScreenProps = {
  locationPermission?: string;
  getLocationPermission: () => void;
};
export function GetLocationScreen({
  locationPermission,
  getLocationPermission,
}: GetLocationScreenProps) {
  return (
    <View style={styles.container}>
      <Text>
        {locationPermission === "denied"
          ? "Para utilizar o aplicativo, é preciso alterar as permissões de localização nas configurações do seu dispositivo."
          : "É preciso permitir o acesso à localização para utilizar o PNAE APP."}
      </Text>
      <Button
        style={styles.button}
        mode="contained"
        buttonColor="teal"
        onPress={() => getLocationPermission()}
      >
        Autorizar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  button: {
    marginTop: 40,
  },
});
