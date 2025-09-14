import { useMutation, useQueryClient } from '@tanstack/react-query'
import { recipeService } from '../../services/recipes.service'

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient()

  const { mutate: updateRecipe, isPending } = useMutation({
    mutationKey: ['updateRecipe'],
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      recipeService.updateRecipe(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['recipes'] })
      await queryClient.invalidateQueries({ queryKey: ['myRecipes'] })
    },
  })

  return { updateRecipe, isPending }
}
