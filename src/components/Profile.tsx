import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	Alert,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	ScrollView,
} from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { NavigationProp } from '../@types/navitagion.types'
import { PAGES } from '../constants/pages'
import { useGetMe } from '../hooks/auth/useGetMe'
import { useUpdateUser } from '../hooks/auth/useUpdateUser'
import { useUploadAvatar } from '../hooks/auth/useUploadAvatar'
import MyRecipesList from './MyRecipes'
import BottomNavigation from './ui/BottomTabs'

type ProfileFormData = {
	currentPassword: string
	name: string
	email: string
	newPassword: string
	avatar: string
}

export default function Profile() {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ProfileFormData>()

	const navigation = useNavigation<NavigationProp>()
	const [avatarUri, setAvatarUri] = useState<string | null>(null)
	const { user, refetch } = useGetMe()
	const { updateUser, isPending } = useUpdateUser()
	const { uploadAvatar } = useUploadAvatar()

	const pickAvatar = async () => {
		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
		if (!permission.granted) {
			alert('Permission to access gallery is required!')
			return
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.7,
		})

		if (!result.canceled) {
			const uri = result.assets[0].uri
			setAvatarUri(uri)
			uploadAvatar(uri)
		}
	}

	const onSubmit = (data: ProfileFormData) => {
		updateUser(
			{
				name: data.name || user?.name,
				email: data.email || user?.email,
				newPassword: data.newPassword,
				currentPassword: data.currentPassword,
			},
			{
				onSuccess: async () => {
					await refetch()
					Alert.alert('✅ Success', 'Profile updated')
				},
				onError: (error: any) => {
					const message =
						error?.response?.data?.error || 'Unable to update profile'
					Alert.alert('❌ Error', message)
				},
			}
		)
	}

	const handleLogout = async () => {
		try {
			await AsyncStorage.removeItem('token')
			navigation.replace(PAGES.LOGIN)
		} catch (error) {
			console.error('Logout error:', error)
		}
	}

	return (
		<View style={styles.container}>
			<ScrollView
				style={styles.scrollWrapper}
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
			>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text style={styles.header}>Profile</Text>
					<TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
						<Ionicons name='log-out-outline' size={20} color='#000000' />
						<Text style={styles.logoutText}>Logout</Text>
					</TouchableOpacity>
				</View>

				<Animated.View style={styles.card} entering={FadeInUp.duration(600)}>
					<TouchableOpacity style={styles.avatarWrapper} onPress={pickAvatar}>
						{avatarUri || user?.avatar ? (
							<Image
								source={{ uri: avatarUri ?? user?.avatar }}
								style={styles.avatar}
							/>
						) : (
							<View style={styles.avatarPlaceholder}>
								<Ionicons name='person-circle-outline' size={90} color='#ccc' />
								<Text style={styles.avatarText}>Tap to add photo</Text>
							</View>
						)}
					</TouchableOpacity>

					<Text style={styles.title}>Edit Profile</Text>

					<View style={styles.inputWrapper}>
						<Ionicons name='person-outline' size={20} color='#888' style={styles.icon} />
						<Controller
							control={control}
							name='name'
							render={({ field: { onChange, value } }) => (
								<TextInput
									style={styles.input}
									placeholder='Full Name'
									placeholderTextColor='#aaa'
									value={value ?? user?.name}
									onChangeText={onChange}
								/>
							)}
						/>
					</View>

					<View style={styles.inputWrapper}>
						<Ionicons name='mail-outline' size={20} color='#888' style={styles.icon} />
						<Controller
							control={control}
							name='email'
							render={({ field: { onChange, value } }) => (
								<TextInput
									style={styles.input}
									placeholder='Email Address'
									placeholderTextColor='#aaa'
									keyboardType='email-address'
									autoCapitalize='none'
									value={value ?? user?.email}
									onChangeText={onChange}
								/>
							)}
						/>
					</View>

					<View style={styles.inputWrapper}>
						<Ionicons name='lock-open-outline' size={20} color='#888' style={styles.icon} />
						<Controller
							control={control}
							name='newPassword'
							render={({ field: { onChange, value } }) => (
								<TextInput
									style={styles.input}
									placeholder='New Password (optional)'
									placeholderTextColor='#aaa'
									secureTextEntry
									value={value}
									onChangeText={onChange}
								/>
							)}
						/>
					</View>

					<View style={styles.inputWrapper}>
						<Ionicons name='lock-closed-outline' size={20} color='#888' style={styles.icon} />
						<Controller
							control={control}
							name='currentPassword'
							render={({ field: { onChange, value } }) => (
								<TextInput
									style={styles.input}
									placeholder='Current Password'
									placeholderTextColor='#aaa'
									secureTextEntry
									value={value}
									onChangeText={onChange}
								/>
							)}
						/>
					</View>

					<TouchableOpacity
						onPress={handleSubmit(onSubmit)}
						disabled={isPending}
						style={{ marginTop: 20 }}
					>
						<LinearGradient
							colors={['#FF8C00', '#FF4E50']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={[styles.button, isPending && { opacity: 0.7 }]}
						>
							<Text style={styles.buttonText}>
								{isPending ? 'Saving...' : 'Save Changes'}
							</Text>
						</LinearGradient>
					</TouchableOpacity>
				</Animated.View>

				<Text style={styles.header}>My Recipes</Text>
				<MyRecipesList />
			</ScrollView>

			<BottomNavigation />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fffaf5',
		paddingHorizontal: 20,
		paddingTop: 50,
	},
	scrollWrapper: {
		maxHeight: 800, 
	},
	scrollContent: {
		paddingBottom: 20,
	},
	header: {
		fontSize: 28,
		fontWeight: '800',
		marginVertical: 16,
		color: '#222',
	},
	card: {
		backgroundColor: '#ffffffee',
		borderRadius: 24,
		padding: 20,
		alignItems: 'center',
		marginBottom: 20,
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 4 },
		elevation: 6,
	},
	avatarWrapper: { marginBottom: 16, alignItems: 'center' },
	avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 6 },
	avatarPlaceholder: { alignItems: 'center' },
	avatarText: { fontSize: 14, color: '#888' },
	title: { fontSize: 26, fontWeight: '700', marginBottom: 16, color: '#222' },
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fdfdfd',
		borderRadius: 14,
		paddingHorizontal: 14,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: '#eee',
		width: '100%',
	},
	icon: { marginRight: 8 },
	input: { flex: 1, fontSize: 16, color: '#333', paddingVertical: 12 },
	error: {
		color: '#ff4d4f',
		fontSize: 13,
		marginBottom: 6,
		marginLeft: 4,
		alignSelf: 'flex-start',
	},
	button: {
		borderRadius: 14,
		paddingVertical: 14,
		alignItems: 'center',
		width: 200,
	},
	buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
	logoutButton: {
		flexDirection: 'row',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 12,
		marginTop: 16,
	},
	logoutText: {
		color: '#000',
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
		position: 'relative',
		top: -2,
	},
})
