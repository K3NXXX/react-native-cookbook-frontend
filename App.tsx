import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { PAGES } from './src/constants/pages'
import HomePage from './src/pages/HomePage'
import LoginPage from './src/pages/LoginPage'
import RegisterPage from './src/pages/RegisterPage'

export type RootStackParamList = {
	Home: undefined
	Register: undefined
	Login: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const queryClient = new QueryClient()

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
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
		</QueryClientProvider>
	)
}
