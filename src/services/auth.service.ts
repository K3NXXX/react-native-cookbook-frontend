import { ILogin, IRegister } from '../@types/auth.types'
import api from '../axios/interceptors'

class AuthService {
	private BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/auth`
	async signup(signUpData: IRegister) {
		console.log(signUpData)
		const { data } = await api.post(`${this.BASE_URL}/register`, signUpData)
		return data
	}

	async login(loginData: ILogin) {
		console.log(loginData)
		const { data } = await api.post(`${this.BASE_URL}/login`, loginData)
		return data
	}

	async getMe() {
		const { data } = await api.get(`${this.BASE_URL}/me`)
		return data.user
	}

	async updateUser(updateData: {
		name?: string
		email?: string
		newPassword?: string
		currentPassword: string
	}) {
		const { data } = await api.put(`${this.BASE_URL}/update`, updateData)
		return data
	}

	async uploadAvatar(avatarUri: string) {
		const { data } = await api.put(`${this.BASE_URL}/avatar`, {
			avatar: avatarUri,
		})
		return data
	}
}

export const authService = new AuthService()
