import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'
import { NavigationProp } from '../../@types/navitagion.types'
import { authService } from '../../services/auth.service'
import { PAGES } from '../../constants/pages'

interface IUpdateUser {
	name?: string
	email?: string
	newPassword?: string
	currentPassword: string
}

export const useUpdateUser = () => {
	const { mutate: updateUser, isPending } = useMutation({
		mutationKey: ['updateUser'],
		mutationFn: (data: IUpdateUser) => authService.updateUser(data),
		
	})

	return { updateUser, isPending }
}
