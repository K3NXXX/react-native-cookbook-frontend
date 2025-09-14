import { useQuery } from '@tanstack/react-query'
import { authService } from '../../services/auth.service'

export const useGetMe = () => {
	const { data: user, isLoading, error, refetch } = useQuery({
		queryKey: ['getMe'],
		queryFn: () => authService.getMe(),
		retry: false, 
	})

	return { user, isLoading, error, refetch }
}
