import axios from 'axios'
import { ILogin, IRegister } from '../@types/auth.types'
import api from '../axios/interceptors'

class AuthService {
	private BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/auth`
	async signup(signUpData: IRegister){
		console.log(signUpData)
		const { data } = await api.post(
			`${this.BASE_URL}/register`,
			signUpData,
		)
		return data
	}

		async login(loginData: ILogin){
		console.log(loginData)
		const { data } = await api.post(
			`${this.BASE_URL}/login`,
			loginData,
		)
		return data
	}
	
}

export const authService = new AuthService()
