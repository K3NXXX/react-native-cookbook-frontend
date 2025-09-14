import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import AddRecipe from './src/components/AddRecipe'
import { PAGES } from './src/constants/pages'
import HomePage from './src/pages/HomePage'
import LoginPage from './src/pages/LoginPage'
import ProfilePage from './src/pages/ProfilePage'
import RegisterPage from './src/pages/RegisterPage'
import FullRecipePage from './src/pages/FullRecipePage'

export type RootStackParamList = {
	Home: undefined
	Register: undefined
	Login: undefined
	AddRecipe: undefined
	Profile: undefined
	FullRecipe: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const queryClient = new QueryClient()

const getToken = async () => {
	try {
		const token = await AsyncStorage.getItem('token')
		if (token) {
			console.log('Token:', token)
			return token
		} else {
			console.log('No token found')
			return null
		}
	} catch (error) {
		console.error('Error reading token', error)
		return null
	}
}

export default function App() {
	const [initialRoute, setInitialRoute] = useState<
		keyof RootStackParamList | null
	>(null)

	useEffect(() => {
		const checkToken = async () => {
			const token = await getToken()
			if (token) {
				setInitialRoute(PAGES.HOME)
			} else {
				setInitialRoute(PAGES.LOGIN)
			}
		}
		checkToken()
	}, [])

	if (!initialRoute) return null

	return (
		<QueryClientProvider client={queryClient}>
			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{ headerShown: false }}
					initialRouteName={initialRoute}
				>
					<Stack.Screen name={PAGES.HOME} component={HomePage} />
					<Stack.Screen name={PAGES.REGISTER} component={RegisterPage} />
					<Stack.Screen name={PAGES.LOGIN} component={LoginPage} />
					<Stack.Screen name={PAGES.ADD_RECIPE} component={AddRecipe} />
					<Stack.Screen name={PAGES.Profile} component={ProfilePage} />
					<Stack.Screen name={PAGES.FULL_RECIPE} component={FullRecipePage} />
				</Stack.Navigator>
			</NavigationContainer>
		</QueryClientProvider>
	)
}
