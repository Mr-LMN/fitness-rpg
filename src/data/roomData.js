import benchmarkAmrap from "./benchmarkAmrap";

export const roomData = {
  mrWatkins: {
    id: "Mr. Watkins' Room",
    requiresWarmup: true,
    hasWorkout: true,
    hasScavenge: true,
    unlocksRoom: "Mrs. John's Room",
    specialWorkout: benchmarkAmrap,
  },
  mrsJohn: {
    id: "Mrs. John's Room",
    requiresWarmup: true,
    hasWorkout: true,
    hasScavenge: false,
    unlocksRoom: "Mrs. Roche's Room",
    specialWorkout: null,
  },
  mrsRoche: {
    id: "Mrs. Roche's Room",
    requiresWarmup: true,
    hasWorkout: true,
    hasScavenge: false,
    unlocksRoom: "Fitness Suite",
    specialWorkout: null,
  },
};

export default roomData;
