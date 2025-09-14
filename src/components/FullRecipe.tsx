import { useRoute, useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  TextInput,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import BottomNavigation from './ui/BottomTabs'
import { useGetMe } from '../hooks/auth/useGetMe'
import { useDeleteRecipe } from '../hooks/recipes/useDeleteRecipe'
import { useUpdateRecipe } from '../hooks/recipes/useUpdateRecipe'
import { NavigationProp } from '../@types/navitagion.types'
import { PAGES } from '../constants/pages'

export default function FullRecipe() {
  const route = useRoute<any>()
  const navigation = useNavigation<NavigationProp>()
  const { recipe } = route.params

  const { user } = useGetMe()
  const { deleteRecipe } = useDeleteRecipe()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [title, setTitle] = useState(recipe.title)
  const [description, setDescription] = useState(recipe.description || '')
  const [ingredients, setIngredients] = useState(
    Array.isArray(recipe.ingredients)
      ? recipe.ingredients.join('\n')
      : String(recipe.ingredients)
  )

  let ingredientsArray: string[] = []
  try {
    if (typeof recipe.ingredients === 'string' && recipe.ingredients.startsWith('[')) {
      ingredientsArray = JSON.parse(recipe.ingredients)
    } else if (Array.isArray(recipe.ingredients)) {
      ingredientsArray = recipe.ingredients
    } else if (typeof recipe.ingredients === 'string') {
      //@ts-ignore
      ingredientsArray = recipe.ingredients.split(',').map(i => i.trim())
    }
  } catch (e) {
    ingredientsArray = [String(recipe.ingredients)]
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteRecipe(recipe.id, {
              onSuccess: () => {
                Alert.alert('✅ Deleted', 'Recipe removed successfully')
                navigation.navigate(PAGES.HOME)
              },
              onError: () => {
                Alert.alert('❌ Error', 'Failed to delete recipe')
              },
            })
          },
        },
      ]
    )
  }

  const isMyRecipe = user?.id === recipe.userId

  return (
    <>
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: recipe.image || 'https://placehold.co/600x300?text=🍽️',
            }}
            style={styles.image}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent']}
            style={styles.overlay}
          />
          <Text style={styles.imageTitle}>{recipe.title}</Text>

          {isMyRecipe && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.iconButton}
                //@ts-ignore
                onPress={() =>   navigation.navigate('EditRecipe', { recipe }) }
              >
                <Ionicons name="pencil" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Ionicons name="trash" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {recipe.description ? (
            <Text style={styles.description}>{recipe.description}</Text>
          ) : null}

          <Text style={styles.subtitle}>🍴 Ingredients</Text>
          <View style={styles.ingredientsWrapper}>
            {ingredientsArray.map((ing, i) => (
              <View key={i} style={styles.ingredientItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.ingredient}>{ing}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      <BottomNavigation />
      <StatusBar
        style="light"
        backgroundColor="rgba(0,0,0,0.6)"
        translucent={false}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fffaf5', flex: 1 },
  imageWrapper: { position: 'relative', width: '100%', height: 250, marginBottom: 10 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 100 },
  imageTitle: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  scrollArea: { maxHeight: 580, paddingHorizontal: 20 },
  scrollContent: { paddingBottom: 20 },
  actionButtons: { position: 'absolute', top: 50, right: 10, flexDirection: 'row', gap: 10 },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 50,
    marginLeft: 6,
  },
  deleteButton: { backgroundColor: 'rgba(255, 77, 77, 0.8)' },
  description: { fontSize: 17, color: '#444', lineHeight: 22, marginBottom: 18, textAlign: 'justify' },
  subtitle: { fontSize: 20, fontWeight: '700', color: '#FF8C00', marginBottom: 10 },
  ingredientsWrapper: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  ingredientItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  bullet: { fontSize: 18, marginRight: 8, color: '#FF4E50' },
  ingredient: { fontSize: 16, color: '#333', flexShrink: 1 },

  // Модалка
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 10 },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  modalButton: { borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20, marginLeft: 10 },
  modalButtonText: { fontSize: 16, fontWeight: '600' },
})
