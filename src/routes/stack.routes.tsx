

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Login } from '../screens/Login'
import { Home } from '../screens/Home'

const { Screen, Navigator } = createNativeStackNavigator();

export function StackRoutes() {
    return (
        <Navigator>
            <Screen
                name='login'
                component={Login}
                options={{ headerShown: false}}
            />
             <Screen
                name='home'
                component={Home}
            />
        </Navigator>
    )
}