import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const fetchWorkoutSummary = async (userId) => {
  try {
    if (!userId) return null;
    const querySnapshot = await getDocs(collection(db, "students", userId, "workouts"));
    const workouts = querySnapshot.docs.map((doc) => doc.data());

    const summary = workouts.reduce(
      (acc, workout) => {
        acc.totalWeight += workout.totalWeightLifted || 0;
        acc.totalDistance += workout.distanceTravelled || 0;
        acc.totalCalories += workout.caloriesBurned || 0;
        acc.totalWorkouts += 1;
        return acc;
      },
      {
        totalWeight: 0,
        totalDistance: 0,
        totalCalories: 0,
        totalWorkouts: 0,
      }
    );

    return summary;
  } catch (error) {
    console.error("\u274c Failed to fetch workout summary:", error);
    return null;
  }
};
