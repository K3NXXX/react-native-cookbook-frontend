import { useNavigation } from '@react-navigation/native'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NavigationProp } from '../../@types/navitagion.types'
import { PAGES } from '../../constants/pages'
import { recipeService } from '../../services/recipes.service'

export const useCreateRecipe = () => {
	const queryClient = useQueryClient()
	const navigation = useNavigation<NavigationProp>()

	const { mutate: createRecipe } = useMutation({
		mutationKey: ['createRecipe'],
		mutationFn: (data: any) => recipeService.createRecipe(data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['recipes'] })
			navigation.navigate(PAGES.HOME)
		},
	})

	return { createRecipe }
}
