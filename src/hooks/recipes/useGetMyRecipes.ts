import { useQuery } from '@tanstack/react-query'
import { recipeService } from '../../services/recipes.service'

export const useGetMyRecipes = () => {
  const { data: recipes, isLoading, error, refetch } = useQuery({
    queryKey: ['myRecipes'],
    queryFn: () => recipeService.getMyRecipes(),
  })

  return { recipes, isLoading, error, refetch }
}
