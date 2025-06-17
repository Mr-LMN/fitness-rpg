export const roomData = {
  mrWatkins: {
    id: "Mr. Watkins' Room",
    requiresWarmup: true,
    hasWorkout: true,
    hasScavenge: true,
    unlocksRoom: "Mrs. John's Room",
  },
  mrsJohn: {
    id: "Mrs. John's Room",
    requiresWarmup: true,
    hasWorkout: true,
    hasScavenge: false,
    unlocksRoom: "Mrs. Roche's Room",
  },
  mrsRoche: {
    id: "Mrs. Roche's Room",
    requiresWarmup: true,
    hasWorkout: true,
    hasScavenge: false,
    unlocksRoom: "Fitness Suite",
  },
};

export default roomData;
