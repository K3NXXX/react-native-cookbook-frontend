import { useQuery } from '@tanstack/react-query'
import { recipeService } from '../../services/recipes.service'

export const useGetRecipes = () => {
  const { data: recipes, isLoading, error, refetch } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => recipeService.getAllRecipes(),
  })

  return { recipes, isLoading, error, refetch }
}
