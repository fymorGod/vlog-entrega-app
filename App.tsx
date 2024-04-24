
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { Home } from './src/screens/Home';
import { Login } from './src/screens/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, StyleSheet, View } from 'react-native';
import { Dash } from './src/screens/Dash';


const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <AuthProvider>
      <Layout></Layout>
    </AuthProvider>
  );
}

export const Layout = () => {
  const { authState, onLogout } = useAuth()

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authState?.authenticated
          ?
          (
            <>
              <Stack.Screen
                name='Home'
                component={Home}
                options={{
                  headerRight: () => <View style={styles.buttonContainer}> 
                    <Button
                      onPress={onLogout}
                      title="Sair"
                      color="#170E49" 
                    />
                  </View>
                }}></Stack.Screen>

              <Stack.Screen
                name='Dash'
                component={Dash}
                options={{
                  headerRight: () => <View style={styles.buttonContainer}>
                    <Button
                      onPress={onLogout}
                      title="Sair"
                      color="#170E49" 
                    />
                  </View>
                }}
              />
            </>
          )
          :
          (<Stack.Screen
            name='Login'
            component={Login}
            options={{ headerShown: false }}
          ></Stack.Screen>)
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginRight: 10,
  },
});