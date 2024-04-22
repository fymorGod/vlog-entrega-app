
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext'; 
import { Home } from './src/screens/Home';
import { Login } from './src/screens/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native';


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
        { authState?.authenticated 
        ? 
        ( <Stack.Screen 
          name='Home' 
          component={Home}
          options={{
            headerRight: () => <Button onPress={onLogout} title="Sair" />,
          }}></Stack.Screen> ) 
        : 
        (<Stack.Screen
          name='Login' 
          component={Login}
          options={{ headerShown: false}}
          ></Stack.Screen>)
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}