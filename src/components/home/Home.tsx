import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'
import BottomTabs from '../ui/BottomTabs'
import { useGetRecipes } from '../../hooks/recipes/useGetRecipes'

export default function Home() {
  const { recipes, isLoading, error } = useGetRecipes()

  if (isLoading) return <Text style={styles.loading}>Loading recipes...</Text>
  if (error) return <Text style={styles.errorText}>❌ Failed to load recipes</Text>

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>

      {/* Search bar */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={20} color="#888" />
        <TextInput
          placeholder="Search recipes..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
        />
      </View>

      {/* Recipes list */}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item, index }) => (
          <Animated.View
            style={styles.card}
            entering={FadeInUp.duration(400).delay(index * 100)}
          >
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <Text style={styles.title}>{item.title}</Text>
            {item.description && (
              <Text style={styles.subtitle} numberOfLines={2}>
                {item.description}
              </Text>
            )}

            <TouchableOpacity style={{ marginTop: 10 }}>
              <LinearGradient
                colors={['#FF8C00', '#FF4E50']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                <Ionicons
                  name="book-outline"
                  size={18}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.buttonText}>View Recipe</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      />

      <BottomTabs />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf5',
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
    color: '#222',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffffee',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    color: '#222',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    shadowColor: '#FF4E50',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loading: {
    textAlign: 'center',
  marginTop: 50,
    fontSize: 18,
    color: '#666',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#ff4d4f',
  },
})
