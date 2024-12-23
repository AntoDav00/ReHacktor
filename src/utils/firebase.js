import { db } from '../config/firebase'
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc
} from 'firebase/firestore'

export const toggleFavorite = async (userId, game) => {
  if (!userId) return;

  const favoriteRef = doc(db, 'favorites', `${userId}_${game.id}`);

  try {
    const docSnap = await getDoc(favoriteRef);

    if (!docSnap.exists()) {
      // Add to favorites
      await setDoc(favoriteRef, {
        userId,
        gameId: game.id,
        gameName: game.name,
        gameImage: game.background_image,
        rating: game.rating,
        released: game.released,
        addedAt: new Date().toISOString()
      });
      return true;
    } else {
      // Remove from favorites
      await deleteDoc(favoriteRef);
      return false;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

export const getFavorites = async (userId) => {
  if (!userId) return [];

  try {
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

export const checkIsFavorite = async (userId, gameId) => {
  if (!userId) return false;

  try {
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('gameId', '==', gameId)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking favorite:', error);
    throw error;
  }
}; 