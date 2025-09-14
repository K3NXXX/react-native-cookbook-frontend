import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { NavigationProp } from '../@types/navitagion.types'
import { useUpdateRecipe } from '../hooks/recipes/useUpdateRecipe'
import { PAGES } from '../constants/pages'

type RecipeFormData = {
	title: string
	description: string
	ingredients: string
	image: string
}

export default function EditRecipe() {
	const route = useRoute<any>()
	const { recipe } = route.params || {}

	const navigation = useNavigation<NavigationProp>()

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
	} = useForm<RecipeFormData>({
		defaultValues: { title: '', description: '', ingredients: '', image: '' },
	})

	const [preview, setPreview] = useState<string | null>(null)
	const { updateRecipe } = useUpdateRecipe()

	useEffect(() => {
		if (recipe) {
			setValue('title', recipe.title || '')
			setValue('description', recipe.description || '')

			if (Array.isArray(recipe.ingredients)) {
				setValue(
					'ingredients',
					//@ts-ignore
					recipe.ingredients.map(i => i.trim()).join('\n')
				)
			} else if (typeof recipe.ingredients === 'string') {
				try {
					const parsed = JSON.parse(recipe.ingredients)
					if (Array.isArray(parsed)) {
						setValue('ingredients', parsed.map(i => i.trim()).join('\n'))
					} else {
						setValue('ingredients', recipe.ingredients)
					}
				} catch {
					setValue('ingredients', recipe.ingredients)
				}
			}

			if (recipe.image) {
				setPreview(recipe.image)
				setValue('image', recipe.image)
			}
		}
	}, [recipe, setValue])

	const pickImage = async () => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync()
		if (!permissionResult.granted) {
			alert('Permission to access gallery is required!')
			return
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 0.7,
		})

		if (!result.canceled) {
			const uri = result.assets[0].uri
			setPreview(uri)
			setValue('image', uri)
		}
	}

	const onSubmit = (data: RecipeFormData) => {
		updateRecipe(
			{
				id: recipe.id,
				data: {
					title: data.title,
					description: data.description,
					image: data.image,
					ingredients: data.ingredients
						.split('\n')
						.filter(i => i.trim() !== ''),
				},
			},
			{
				onSuccess: () => {
					alert('✅ Recipe updated successfully!')
					navigation.navigate(PAGES.HOME)
				},
				onError: () => alert('❌ Failed to update recipe'),
			}
		)
	}

	if (!recipe) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text style={{ fontSize: 18, color: 'red' }}>❌ No recipe data</Text>
			</View>
		)
	}

	return (
		<KeyboardAwareScrollView
			style={styles.container}
			contentContainerStyle={styles.scrollContent}
			enableOnAndroid
			extraScrollHeight={50}
			keyboardShouldPersistTaps='handled'
		>
			<Animated.View style={styles.card} entering={FadeInUp.duration(600)}>
				<Text style={styles.title}>Edit Recipe</Text>
				<Text style={styles.subtitle}>Update your dish ✏️</Text>

				{/* Title */}
				<View style={styles.inputWrapper}>
					<Ionicons
						name='restaurant-outline'
						size={20}
						color='#888'
						style={styles.icon}
					/>
					<Controller
						control={control}
						name='title'
						rules={{ required: 'Title is required' }}
						render={({ field: { onChange, value } }) => (
							<TextInput
								style={styles.input}
								placeholder='Recipe title'
								placeholderTextColor='#aaa'
								value={value}
								onChangeText={onChange}
							/>
						)}
					/>
				</View>
				{errors.title && (
					<Text style={styles.error}>{errors.title.message}</Text>
				)}

				{/* Image Picker */}
				<TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
					<Ionicons
						name='image-outline'
						size={20}
						color='#888'
						style={{ marginRight: 8 }}
					/>
					<Text style={{ color: '#555' }}>
						{preview ? 'Change image' : 'Choose image'}
					</Text>
				</TouchableOpacity>

				{preview && (
					<Image source={{ uri: preview }} style={styles.previewImage} />
				)}

				{/* Description */}
				<View style={styles.textAreaWrapper}>
					<Controller
						control={control}
						name='description'
						render={({ field: { onChange, value } }) => (
							<TextInput
								style={[styles.input, { height: 80 }]}
								multiline
								placeholder='Short description'
								placeholderTextColor='#aaa'
								value={value}
								onChangeText={onChange}
							/>
						)}
					/>
				</View>

				{/* Ingredients */}
				<View style={styles.textAreaWrapper}>
					<Controller
						control={control}
						name='ingredients'
						rules={{ required: 'Ingredients are required' }}
						render={({ field: { onChange, value } }) => (
							<TextInput
								style={[styles.input, { height: 100 }]}
								multiline
								placeholder='Ingredients (one per line)'
								placeholderTextColor='#aaa'
								value={value}
								onChangeText={onChange}
							/>
						)}
					/>
				</View>
				{errors.ingredients && (
					<Text style={styles.error}>{errors.ingredients.message}</Text>
				)}

				<TouchableOpacity
					onPress={handleSubmit(onSubmit)}
					disabled={isSubmitting}
				>
					<LinearGradient
						colors={['#FF8C00', '#FF4E50']}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={[styles.button, isSubmitting && { opacity: 0.7 }]}
					>
						<Text style={styles.buttonText}>
							{isSubmitting ? 'Saving...' : 'Update Recipe'}
						</Text>
					</LinearGradient>
				</TouchableOpacity>
			</Animated.View>
		</KeyboardAwareScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fffaf5',
		paddingHorizontal: 20,
	},
	scrollContent: {
		minHeight: '100%',
		justifyContent: 'center',
		paddingBottom: 100,
	},
	card: {
		backgroundColor: '#ffffffee',
		borderRadius: 24,
		padding: 28,
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 4 },
		elevation: 6,
	},
	title: {
		fontSize: 28,
		fontWeight: '800',
		textAlign: 'center',
		marginBottom: 8,
		color: '#222',
	},
	subtitle: {
		textAlign: 'center',
		fontSize: 16,
		color: '#777',
		marginBottom: 24,
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fdfdfd',
		borderRadius: 14,
		paddingHorizontal: 14,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: '#eee',
	},
	imagePicker: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fdfdfd',
		borderRadius: 14,
		padding: 14,
		borderWidth: 1,
		borderColor: '#eee',
		marginBottom: 12,
	},
	previewImage: {
		width: '100%',
		height: 180,
		borderRadius: 14,
		marginBottom: 12,
	},
	textAreaWrapper: {
		backgroundColor: '#fdfdfd',
		borderRadius: 14,
		paddingHorizontal: 14,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: '#eee',
	},
	icon: {
		marginRight: 8,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: '#333',
		paddingVertical: 12,
	},
	error: {
		color: '#ff4d4f',
		fontSize: 13,
		marginBottom: 6,
		marginLeft: 4,
	},
	button: {
		borderRadius: 14,
		paddingVertical: 16,
		alignItems: 'center',
		shadowColor: '#FF4E50',
		shadowOpacity: 0.3,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 3 },
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '700',
		letterSpacing: 0.5,
	},
})
