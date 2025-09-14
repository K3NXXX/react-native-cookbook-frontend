import { useMutation, useQueryClient } from '@tanstack/react-query'
import { recipeService } from '../../services/recipes.service'

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient()

  const { mutate: deleteRecipe, isPending } = useMutation({
    mutationKey: ['deleteRecipe'],
    mutationFn: (id: number) => recipeService.deleteRecipe(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['recipes'] })
      await queryClient.invalidateQueries({ queryKey: ['myRecipes'] })
    },
  })

  return { deleteRecipe, isPending }
}
