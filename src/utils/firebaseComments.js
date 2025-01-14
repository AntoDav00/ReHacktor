import { db } from '../config/firebase'
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  where,
  Timestamp
} from 'firebase/firestore'

export const addComment = async (userId, gameId, comment) => {
  try {
    await addDoc(collection(db, 'comments'), {
      userId, // Salva l'email completa
      userEmail: userId.split('@')[0], // Username per display
      userUid: userId, // Salva l'UID dell'utente
      gameId,
      text: comment,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getComments = async (userId = null, gameId = null) => {
  try {
    const commentsRef = collection(db, 'comments');
    let q = query(commentsRef, orderBy('createdAt', 'desc'));

    // Se è specificato un userId, filtra per quel utente
    if (userId) {
      q = query(commentsRef, 
        where('userId', '==', userId)
      );
    } else if (gameId) {
      // Se è specificato un gameId, filtra per quel gioco
      q = query(commentsRef, 
        where('gameId', '==', gameId)
      );
    }

    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map(doc => {
      const commentData = doc.data();
      
      return {
        id: doc.id,
        ...commentData,
        createdAt: commentData.createdAt instanceof Timestamp 
          ? commentData.createdAt.toDate().toISOString() 
          : commentData.createdAt
      };
    });

    return comments;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    // Ottieni il riferimento al documento del commento
    const commentRef = doc(db, 'comments', commentId);
    
    // Elimina il documento
    await deleteDoc(commentRef);
  } catch (error) {
    console.error('Errore durante l\'eliminazione del commento:', error);
    
    // Se l'errore è di permessi, fornisci un messaggio più dettagliato
    if (error.code === 'permission-denied') {
      throw new Error('Non hai i permessi per eliminare questo commento. Assicurati di essere l\'autore.');
    }
    
    throw error;
  }
};