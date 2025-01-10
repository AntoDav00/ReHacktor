import { db } from '../config/firebase'
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore'

export const addComment = async (userId, gameId, comment) => {
  try {
    await addDoc(collection(db, 'comments'), {
      userId,
      gameId,
      text: comment,
      createdAt: serverTimestamp(),
      userEmail: userId.split('@')[0] // Store username for display
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getComments = async () => {
  try {
    const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString()
    }));
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    await deleteDoc(doc(db, 'comments', commentId));
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}; 