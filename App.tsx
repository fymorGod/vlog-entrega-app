import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext, AuthProvider } from "./src/context/AuthContext";
import { Home } from "./src/screens/Home";
import { Login } from "./src/screens/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, StyleSheet, View } from "react-native";
import { Dash } from "./src/screens/Dash";
import { InitScanner } from "./src/screens/InitScanner";

import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <Layout></Layout>
    </AuthProvider>
  );
}

export const Layout = () => {
  const { token, authenticated, logout, user } = useContext(AuthContext)

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authenticated && token != null ? (
          <>
           <Stack.Screen
              name="ScannerNFe"
              component={InitScanner}
              options={{
                headerRight: () => (
                  <View style={styles.buttonContainer}>
                    <Button onPress={logout} title="Sair" color="#170E49" />
                  </View>
                )
              }}
            ></Stack.Screen>

            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerRight: () => (
                  <View style={styles.buttonContainer}>
                    <Button onPress={logout} title="Sair" color="#170E49" />
                  </View>
                ),
              }}
            ></Stack.Screen>

            <Stack.Screen
              name="Dash"
              component={Dash}
              options={{
                title: `${user?.lojaInfo}`,
                headerTintColor: "#f/4511e",
                headerRight: () => (
                  <View style={styles.buttonContainer}>
                    <Button onPress={logout} title="Sair" color="#170E49" />
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
          ></Stack.Screen>
        )}
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginRight: 10,
  },
});
