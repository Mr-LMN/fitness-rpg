import { doc, setDoc, serverTimestamp, increment } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Create or update a user's profile document in Firestore.
 * Called on character creation and after each workout.
 */
export async function updateUserProfile({
  userId,
  studentName,
  yearGroup,
  avatar,
  xp = 0,
  workoutData = null,
}) {
  if (!userId) return;

  const profileRef = doc(db, "userProfiles", userId);

  const baseUpdate = {
    userId,
    studentName: studentName || "Unknown",
    yearGroup: yearGroup || null,
    avatar: avatar || "pirate",
    xp,
    lastActive: serverTimestamp(),
  };

  if (workoutData) {
    baseUpdate.totalWorkouts = increment(1);
    if (workoutData.caloriesBurned) {
      baseUpdate.totalCalories = increment(Math.round(workoutData.caloriesBurned));
    }
    if (workoutData.totalWeightLifted) {
      baseUpdate.totalWeightLifted = increment(Math.round(workoutData.totalWeightLifted));
    }
    if (workoutData.minutesLogged) {
      baseUpdate.totalMinutes = increment(Math.round(workoutData.minutesLogged));
    }
  }

  try {
    await setDoc(profileRef, baseUpdate, { merge: true });
  } catch (error) {
    console.error("Failed to update user profile:", error);
  }
}

/**
 * Update just the XP and avatar on an existing profile.
 */
export async function syncUserXP({ userId, xp, avatar, badges = [] }) {
  if (!userId) return;
  const profileRef = doc(db, "userProfiles", userId);
  try {
    await setDoc(
      profileRef,
      { xp, avatar, badgeCount: badges.length, lastActive: serverTimestamp() },
      { merge: true }
    );
  } catch (error) {
    console.error("Failed to sync user XP:", error);
  }
}
