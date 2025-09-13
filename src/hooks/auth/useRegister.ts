import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'
import { IRegister } from '../../@types/auth.types'
import { NavigationProp } from '../../@types/navitagion.types'
import { authService } from '../../services/auth.service'
import { PAGES } from '../../constants/pages'

export const useRegister = () => {
	const navigation = useNavigation<NavigationProp>()
	const { mutate: register } = useMutation({
		mutationKey: ['register'],
		mutationFn: (data: IRegister) => authService.signup(data),
		onSuccess: async data => {
			try {
				await AsyncStorage.setItem('token', data.token)
				navigation.navigate(PAGES.HOME)
			} catch (e) {
				console.error('Failed to save token', e)
			}
		},
	})

	return { register }
}
