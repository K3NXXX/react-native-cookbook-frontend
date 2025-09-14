import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { NavigationProp } from '../../@types/navitagion.types'
import { PAGES } from '../../constants/pages'

export default function BottomNavigation() {
	const navigation = useNavigation<NavigationProp>()

	return (
		<View style={styles.container} pointerEvents='box-none'>
			<TouchableOpacity
				onPress={() => navigation.navigate(PAGES.HOME)}
				style={styles.iconButton}
			>
				<Ionicons name='home-outline' size={24} color='#555' />
				<Text style={styles.label}>Home</Text>
			</TouchableOpacity>

			<View style={styles.addWrapper}>
				<TouchableOpacity
					onPress={() => navigation.navigate(PAGES.ADD_RECIPE)}
					style={styles.addButton}
					activeOpacity={0.8}
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
				>
					<Ionicons name='add' size={30} color='#fff' />
				</TouchableOpacity>
			</View>

			<TouchableOpacity
				onPress={() => navigation.navigate(PAGES.Profile)}
				style={styles.iconButton}
			>
				<Ionicons name='person-outline' size={24} color='#555' />
				<Text style={styles.label}>Profile</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		paddingVertical: 8,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		shadowRadius: 6,
		position: 'absolute',
		bottom: 50,
		right: 0,
		left: 0,
	},
	iconButton: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},
	label: {
		fontSize: 12,
		color: '#555',
		marginTop: 2,
	},
	addWrapper: {
		position: 'absolute',
		bottom: 10,
		alignSelf: 'center',
		shadowColor: '#FF4E50',
		shadowOpacity: 0.3,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 3 },
		elevation: 12,
		zIndex: 10,
	},
	addButton: {
		width: 50,
		height: 50,
		borderRadius: 35,
		backgroundColor: '#fa6925',
		justifyContent: 'center',
		alignItems: 'center',
	},
})
