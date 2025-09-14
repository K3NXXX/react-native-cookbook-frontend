import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '../../services/auth.service'
import { useGetMe } from './useGetMe'

export const useUploadAvatar = () => {
	const queryClient = useQueryClient()

	const { mutate: uploadAvatar, isPending } = useMutation({
		mutationKey: ['uploadAvatar'],
		mutationFn: (avatarUri: string) => authService.uploadAvatar(avatarUri),
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ['getMe'] })
		},
	})

	return { uploadAvatar, isPending }
}
