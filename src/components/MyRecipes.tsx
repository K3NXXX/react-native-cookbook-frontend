import React from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useGetMyRecipes } from '../hooks/recipes/useGetMyRecipes'
import { NavigationProp } from '../@types/navitagion.types'
import { PAGES } from '../constants/pages'

export default function MyRecipesList() {
	const { recipes, isLoading } = useGetMyRecipes()
	const navigation = useNavigation<NavigationProp>()

	if (isLoading) {
		return <Text style={styles.loadingText}>Loading...</Text>
	}

	if (!recipes || recipes.length === 0) {
		return <Text style={styles.emptyText}>You have no recipes yet</Text>
	}

	return (
		<FlatList
			data={recipes}
			keyExtractor={(item) => item.id.toString()}
			contentContainerStyle={styles.listContainer}
			renderItem={({ item }) => (
				<TouchableOpacity
					style={styles.recipeCard}
					activeOpacity={0.7}
					//@ts-ignore
					onPress={() => navigation.navigate(PAGES.FULL_RECIPE, { recipe: item })}
				>
					<View style={styles.imageWrapper}>
						<Image
							source={{
								uri: item.image || 'https://placehold.co/100x100?text=🍽️',
							}}
							style={styles.recipeImage}
						/>
					</View>

					<View style={styles.recipeContent}>
						<Text style={styles.recipeTitle}>{item.title}</Text>
						{item.description ? (
							<Text numberOfLines={1} style={styles.recipeDescription}>
								{item.description}
							</Text>
						) : null}
					</View>
				</TouchableOpacity>
			)}
		/>
	)
}

const styles = StyleSheet.create({
	listContainer: {
		paddingVertical: 8,
	},
	loadingText: { textAlign: 'center', marginVertical: 10, fontSize: 16, color: '#777' },
	emptyText: { textAlign: 'center', marginVertical: 10, fontSize: 16, color: '#aaa' },
	recipeCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#ffffff',
		borderRadius: 18,
		padding: 12,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 2 },
		elevation: 3,
	},
	imageWrapper: {
		width: 60,
		height: 60,
		borderRadius: 12,
		overflow: 'hidden',
		marginRight: 12,
	},
	recipeImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},
	recipeContent: {
		flex: 1,
		justifyContent: 'center',
	},
	recipeTitle: {
		fontSize: 16,
		fontWeight: '700',
		color: '#222',
		marginBottom: 2,
	},
	recipeDescription: {
		fontSize: 14,
		color: '#666',
	},
})
