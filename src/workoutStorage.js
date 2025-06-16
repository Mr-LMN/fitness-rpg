import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Save workout session to Firestore
export const saveWorkoutSession = async (userId, workoutData) => {
  try {
    await addDoc(collection(db, 'students', userId, 'workouts'), {
      ...workoutData,
      createdAt: serverTimestamp(),
    });
    console.log('Workout session saved!');
  } catch (error) {
    console.error('Error saving workout:', error);
  }
};
