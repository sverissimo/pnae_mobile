import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { useAuth } from "../auth/hooks/useAuth";
import { globalColors } from "@constants/themes";
const { primary, grayscale } = globalColors;

const LoginScreen = () => {
  const { user, inputHandler, loginHandler, isLoading } = useAuth();
  return (
    <View style={styles.loginForm}>
      <View style={styles.formContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Emater - PNAE Mobile</Text>
          <Image
            source={require("../assets/demeter_logo.png")}
            style={styles.logo}
          />
          <Text style={styles.headerText}>Entre com sua matrícula e senha</Text>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.formControl}
              inputMode="tel"
              placeholder="Matrícula"
              value={user?.matricula_usuario}
              onChangeText={(value) => inputHandler("matricula_usuario", value)}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.formControl}
              placeholder="Senha"
              secureTextEntry={true}
              value={user?.password}
              onChangeText={(value) => inputHandler("senha", value)}
            />
          </View>
          <Pressable
            style={{
              ...styles.btn,
              backgroundColor: isLoading ? grayscale[300] : primary[800],
            }}
            android_ripple={{ color: "green" }}
            onPress={loginHandler}
            disabled={isLoading}
          >
            <Text style={styles.btnText}>Entrar</Text>
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
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "#f5fff5",
    backgroundColor: "#eee",
  },
  formContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: "10%",
    paddingVertical: "10%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
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
  headerText: {},

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

export default LoginScreen;
