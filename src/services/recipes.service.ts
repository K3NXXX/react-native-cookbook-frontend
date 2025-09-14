import api from '../axios/interceptors'

class RecipeService {
	private BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/recipes`

	async createRecipe(data: {
		title: string
		description?: string
		image?: string
		ingredients: string[]
	}) {
		const { data: res } = await api.post(this.BASE_URL, data)
		return res
	}

	async getAllRecipes() {
		const { data } = await api.get(this.BASE_URL)
		return data.recipes
	}

	async getMyRecipes() {
		const { data } = await api.get(`${this.BASE_URL}/my`)
		return data.recipes
	}

	async updateRecipe(
		id: number,
		data: {
			title?: string
			description?: string
			image?: string
			ingredients?: string[]
		}
	) {
		const { data: res } = await api.put(`${this.BASE_URL}/${id}`, data)
		return res
	}

	async deleteRecipe(id: number) {
		const { data } = await api.delete(`${this.BASE_URL}/${id}`)
		return data
	}
}

export const recipeService = new RecipeService()
