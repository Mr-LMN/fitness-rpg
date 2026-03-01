import exerciseList from "../data/exerciseList";
import cardioExercises from "../data/cardioExercises";
import { parseWeightInput, estimateCalories } from "../utils";

const lookup = new Map();
[...exerciseList, ...cardioExercises].forEach((exercise) => {
  if (exercise?.name) {
    lookup.set(exercise.name, exercise);
  }
});

export function getExerciseMeta(name) {
  if (!name) return null;
  return lookup.get(name) || null;
}

export function calculateWorkoutMetrics(entries = [], userWeightKg = 50, fallbackFocus = "strength") {
  let totalWeight = 0;
  let distance = 0;
  let calories = 0;
  let minutes = 0;

  entries.forEach((entry) => {
    if (!entry) return;
    const meta = getExerciseMeta(entry.name) || {
      met: fallbackFocus === "cardio" ? 8 : 4.5,
      type: fallbackFocus === "cardio" ? "Cardio" : "Strength",
      category: entry.category || fallbackFocus,
    };

    const type = (entry.type || meta.type || "Strength").toLowerCase();

    if (type === "cardio" || entry.duration !== undefined || entry.distance !== undefined) {
      const duration = Number(entry.duration) || 0;
      const dist = Number(entry.distance) || 0;
      if (dist > 0) {
        distance += dist;
      }
      if (duration > 0) {
        minutes += duration;
      }
      calories += estimateCalories({
        exercise: meta,
        userWeightKg,
        durationMin: duration > 0 ? duration : Math.max(dist * 6, 0),
      });
    } else {
      const sets = Number(entry.sets) || 0;
      const reps = Number(entry.reps) || 0;
      const weight =
        entry.numericWeight !== undefined
          ? Number(entry.numericWeight) || 0
          : parseWeightInput(entry.weight, userWeightKg);
      totalWeight += sets * reps * Math.max(weight, 0);
      // ~4 s per rep + 45 s rest between sets (matches estimateCalories)
      const activeTimeSec = sets * reps * 4;
      const restTimeSec = Math.max(sets - 1, 0) * 45;
      minutes += (activeTimeSec + restTimeSec) / 60;
      calories += estimateCalories({
        exercise: meta,
        userWeightKg,
        sets,
        reps,
        weightLiftedPerRep: Math.max(weight, 0),
      });
    }
  });

  return {
    totalWeight,
    distance,
    calories,
    minutes,
  };
}
