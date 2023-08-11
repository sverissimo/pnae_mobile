import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useSelectProdutor } from "../hooks/useSelectProdutor";
import { useLayoutEffect } from "react";
import { useCustomNavigation } from "../hooks/useCustomNavigation";

export const ProdutorSelectScreen = () => {
  const { produtor, inputHandler, getProdutor } = useSelectProdutor();
  const { navigation } = useCustomNavigation();

  useLayoutEffect(() => {
    if (produtor) {
      navigation.goBack();
    }
  }, [navigation, produtor]);

  return (
    <View style={styles.loginForm}>
      <View style={styles.formContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Digite o CPF / CNPJ do cliente</Text>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.formControl}
              inputMode="text"
              placeholder="CPF / CNPJ do produtor"
              value={produtor?.cpf}
              onChangeText={(value) => inputHandler("cpf", value)}
            />
          </View>
          <Pressable
            style={styles.btn}
            android_ripple={{ color: "green" }}
            onPress={getProdutor}
          >
            <Text style={styles.btnText}>Pesquisar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loginForm: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#caa",
    //backgroundColor: "white",
  },
  formContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: "10%",
    paddingVertical: "10%",
    /*   shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3, */
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: "12%",
  },
  headerTitle: {
    fontSize: 19,
    marginBottom: "8%",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    borderColor: "#ddd",
    borderWidth: 2,
    marginBottom: "11%",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "500",
  },

  bodyContainer: {
    justifyContent: "space-between",
  },
  inputGroup: {
    marginBottom: 10,
  },
  formControl: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  btn: {
    backgroundColor: "#5cb85c",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
