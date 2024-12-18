import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext, AuthProvider } from "./src/context/AuthContext";
import { Home } from "./src/screens/Home";
import { Login } from "./src/screens/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dash } from "./src/screens/Dash";
import { InitScanner } from "./src/screens/InitScanner";
import Toast from 'react-native-toast-message';
import { MenuScreen } from "./src/screens/Menu";
import { AuditoriaScreen } from "./src/screens/Auditoria";
import { HomeAuditoria } from "./src/screens/HomeAuditoria";
import { ProdutoScan } from "./src/screens/ProdutoScan";
import { ProdutoScreen } from "./src/screens/Produto";
import { Auditados } from "./src/screens/Auditados";
import { Inspector } from "./src/screens/Inspector";
import { Inspecao } from "./src/screens/Inspecao";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

// Layout app
export const Layout = () => {
  const { token, authenticated, logout, user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authenticated && token ? (
          <>
            <Stack.Screen
              name="Menu"
              component={MenuScreen}
              options={{
                headerRight: () => (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                      <Text style={styles.logoutButtonText}>Sair</Text>
                    </TouchableOpacity>
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="ScannerNFe"
              component={InitScanner}
              options={{
                headerRight: () => (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                      <Text style={styles.logoutButtonText}>Sair</Text>
                    </TouchableOpacity>
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerRight: () => (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                      <Text style={styles.logoutButtonText}>Sair</Text>
                    </TouchableOpacity>
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="Auditoria"
              component={AuditoriaScreen}
              options={{
                headerRight: () => (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                      <Text style={styles.logoutButtonText}>Sair</Text>
                    </TouchableOpacity>
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="Inspetor"
              component={Inspector}
              options={{
                headerRight: () => (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                      <Text style={styles.logoutButtonText}>Sair</Text>
                    </TouchableOpacity>
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="Inspecao"
              component={Inspecao}
              options={{
                headerRight: () => (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                      <Text style={styles.logoutButtonText}>Sair</Text>
                    </TouchableOpacity>
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="HomeAuditoria"
              component={HomeAuditoria}
              options={{
                headerRight: () => (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                      <Text style={styles.logoutButtonText}>Sair</Text>
                    </TouchableOpacity>
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="ProdutoAuditoria"
              component={ProdutoScreen}
              options={{
                headerRight: () => (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                      <Text style={styles.logoutButtonText}>Sair</Text>
                    </TouchableOpacity>
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="ProdutoScan"
              component={ProdutoScan}
              options={{
                headerRight: () => (
                  <View style={styles.buttonContainer}>
                    <Button onPress={logout} title="Sair" color="#170E49" />
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="Auditados"
              component={Auditados}
              options={{
                headerRight: () => (
                  <View style={styles.buttonContainer}>
                    <Button onPress={logout} title="Sair" color="#170E49" />
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="Dash"
              component={Dash}
              options={{
                title: user?.lojaInfo || 'Dash',
                headerTintColor: "#f4511e",
                headerRight: () => (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                      <Text style={styles.logoutButtonText}>Sair</Text>
                    </TouchableOpacity>
                  </View>
                ),
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginRight: 10,
    borderRadius: 8,
  },
  logoutButton: {
    backgroundColor: '#170E49',
    borderRadius: 20,
    padding: 2.5,
  },
  logoutButtonText: {
    fontSize: 20,
    color: '#fff',
    width: 50,
    textAlign: 'center',
  },
});
