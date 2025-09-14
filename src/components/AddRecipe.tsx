import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
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
import { useCreateRecipe } from '../hooks/recipes/useCreateRecipe'
import BottomNavigation from './ui/BottomTabs'

type RecipeFormData = {
	title: string
	description: string
	ingredients: string
	image: string
}

export default function AddRecipe() {
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
	} = useForm<RecipeFormData>({
		defaultValues: { title: '', description: '', ingredients: '', image: '' },
	})

	const [preview, setPreview] = useState<string | null>(null)
	const { createRecipe } = useCreateRecipe()

	const pickImage = async () => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync()
		if (permissionResult.granted === false) {
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

	const onSubmit =  (data: RecipeFormData) => {
		console.log('data', data)
		createRecipe(
			{
				title: data.title,
				description: data.description,
				image: data.image,
				ingredients: data.ingredients.split('\n').filter(i => i.trim() !== ''),
			},
			{
				onSuccess: () => {
					alert('✅ Recipe created successfully!')
				},
				onError: (error: any) => {
					console.error(error)
					alert('❌ Failed to create recipe')
				},
			}
		)
	}

	return (
		<KeyboardAwareScrollView
			style={styles.container}
			contentContainerStyle={{
				flexGrow: 1,
				justifyContent: 'center',
				paddingBottom: 100,
			}}
			enableOnAndroid
			extraScrollHeight={30}
			keyboardShouldPersistTaps='handled'
		>
			<Animated.View style={styles.card} entering={FadeInUp.duration(600)}>
				<Text style={styles.title}>Add Recipe</Text>
				<Text style={styles.subtitle}>Share your favorite dish 🍲</Text>

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
						{preview ? 'Change image' : 'Choose image from gallery'}
					</Text>
				</TouchableOpacity>

				{/* Preview */}
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
						rules={{
							required: 'Ingredients are required',
							validate: value => {
								const lines = value.split('\n').filter(l => l.trim() !== '')
								if (lines.length === 0)
									return 'Please add at least one ingredient'

								for (let line of lines) {
									if (line.trim().length < 3) {
										return 'Each ingredient must be at least 3 characters long'
									}
								}

								return true
							},
						}}
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
					style={{ marginTop: 20 }}
				>
					<LinearGradient
						colors={['#FF8C00', '#FF4E50']}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={[styles.button, isSubmitting && { opacity: 0.7 }]}
					>
						<Text style={styles.buttonText}>
							{isSubmitting ? 'Saving...' : 'Save Recipe'}
						</Text>
					</LinearGradient>
				</TouchableOpacity>
			</Animated.View>
			<BottomNavigation />
		</KeyboardAwareScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fffaf5',
		paddingHorizontal: 20,
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
