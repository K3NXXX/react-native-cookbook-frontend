import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'
import { ILogin } from '../../@types/auth.types'
import { authService } from '../../services/auth.service'
import { NavigationProp } from '../../@types/navitagion.types'
import { PAGES } from '../../constants/pages'

export const useLogin = () => {
	const navigation = useNavigation<NavigationProp>()
	const { mutate: login } = useMutation({
		mutationKey: ['login'],
		mutationFn: (data: ILogin) => authService.login(data),
		onSuccess: async data => {
			try {
				await AsyncStorage.setItem('token', data.token)
				navigation.navigate(PAGES.HOME)
			} catch (e) {
				console.error('Failed to save token', e)
			}
		},
	})

	return { login }
}
