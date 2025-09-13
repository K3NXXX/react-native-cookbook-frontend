import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { NavigationProp } from '../../@types/navitagion.types'
import { PAGES } from '../../constants/pages'
import { useRegister } from '../../hooks/auth/useRegister'

type FormData = {
	name: string
	email: string
	password: string
	confirmPassword: string
}

export default function Register() {
	const {
		control,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
	})
	const { register } = useRegister()
	const navigation = useNavigation<NavigationProp>()

	const onSubmit = (data: FormData) => {
		const registerData = {
			name: data.name,
			email: data.email,
			password: data.password,
			confirmPassword: data.confirmPassword,
		}
		register(registerData)
	}

	const passwordValue = watch('password')

	return (
		<KeyboardAwareScrollView
			style={styles.container}
			contentContainerStyle={{
				flexGrow: 1,
				justifyContent: 'center',
			}}
			enableOnAndroid={true}
			extraScrollHeight={30}
			keyboardShouldPersistTaps='handled'
		>
			<Animated.View style={styles.card} entering={FadeInUp.duration(600)}>
				<Text style={styles.title}>Sign Up</Text>
				<Text style={styles.subtitle}>Join our culinary community 🍳</Text>

				<View style={styles.inputWrapper}>
					<Ionicons
						name='person-outline'
						size={20}
						color='#888'
						style={styles.icon}
					/>
					<Controller
						control={control}
						name='name'
						rules={{ required: 'Name is required' }}
						render={({ field: { onChange, value } }) => (
							<TextInput
								style={styles.input}
								placeholder='Full Name'
								placeholderTextColor='#aaa'
								value={value}
								onChangeText={onChange}
							/>
						)}
					/>
				</View>
				{errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

				<View style={styles.inputWrapper}>
					<Ionicons
						name='mail-outline'
						size={20}
						color='#888'
						style={styles.icon}
					/>
					<Controller
						control={control}
						name='email'
						rules={{
							required: 'Email is required',
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: 'Invalid email address',
							},
						}}
						render={({ field: { onChange, value } }) => (
							<TextInput
								style={styles.input}
								placeholder='Email Address'
								placeholderTextColor='#aaa'
								keyboardType='email-address'
								autoCapitalize='none'
								value={value}
								onChangeText={onChange}
							/>
						)}
					/>
				</View>
				{errors.email && (
					<Text style={styles.error}>{errors.email.message}</Text>
				)}

				<View style={styles.inputWrapper}>
					<Ionicons
						name='lock-closed-outline'
						size={20}
						color='#888'
						style={styles.icon}
					/>
					<Controller
						control={control}
						name='password'
						rules={{
							required: 'Password is required',
							minLength: { value: 6, message: 'Minimum 6 characters' },
						}}
						render={({ field: { onChange, value } }) => (
							<TextInput
								style={styles.input}
								placeholder='Password'
								placeholderTextColor='#aaa'
								secureTextEntry
								value={value}
								onChangeText={onChange}
							/>
						)}
					/>
				</View>
				{errors.password && (
					<Text style={styles.error}>{errors.password.message}</Text>
				)}

				<View style={styles.inputWrapper}>
					<Ionicons
						name='lock-closed-outline'
						size={20}
						color='#888'
						style={styles.icon}
					/>
					<Controller
						control={control}
						name='confirmPassword'
						rules={{
							required: 'Please confirm your password',
							validate: value =>
								value === passwordValue || 'Passwords do not match',
						}}
						render={({ field: { onChange, value } }) => (
							<TextInput
								style={styles.input}
								placeholder='Confirm Password'
								placeholderTextColor='#aaa'
								secureTextEntry
								value={value}
								onChangeText={onChange}
							/>
						)}
					/>
				</View>
				{errors.confirmPassword && (
					<Text style={styles.error}>{errors.confirmPassword.message}</Text>
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
							{isSubmitting ? 'Please wait...' : 'Create Account'}
						</Text>
					</LinearGradient>
				</TouchableOpacity>

				<Text
					onPress={() => navigation.navigate(PAGES.LOGIN)}
					style={styles.footerText}
				>
					Already have an account? <Text style={styles.link}>Log In</Text>
				</Text>
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
		fontSize: 30,
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
	icon: {
		marginRight: 8,
	},
	input: {
		flex: 1,
		height: 48,
		fontSize: 16,
		color: '#333',
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
	footerText: {
		textAlign: 'center',
		marginTop: 20,
		fontSize: 14,
		color: '#555',
	},
	link: {
		color: '#FF4E50',
		fontWeight: '700',
	},
})
