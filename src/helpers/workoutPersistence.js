import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function persistWorkoutLog({ userId, yearGroup, workoutData }) {
  if (!userId) {
    console.warn("persistWorkoutLog called without a userId");
    return;
  }

  try {
    await addDoc(collection(db, "workouts"), {
      userId,
      yearGroup: yearGroup || null,
      ...workoutData,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("❌ Error logging workout to Firestore:", error);
    throw error;
  }
}
