import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { StyleSheet } from 'react-native'
import { PAGES } from './src/constants/pages'
import HomePage from './src/pages/HomePage'
import LoginPage from './src/pages/LoginPage'
import RegisterPage from './src/pages/RegisterPage'

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Login: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();


export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{ headerShown: false }}
				initialRouteName='Register'
			>
				<Stack.Screen
					name={PAGES.HOME}
					component={HomePage}
					options={{ title: 'Home' }}
				/>
				<Stack.Screen
					name={PAGES.REGISTER}
					component={RegisterPage}
					options={{ title: 'Register' }}
				/>
				<Stack.Screen
					name={PAGES.LOGIN}
					component={LoginPage}
					options={{ title: 'Login' }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
	},
})
