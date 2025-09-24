<script>
  import { onMount } from 'svelte';
  import { db, auth } from '$lib/firebase';
  import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
  import { goto } from '$app/navigation';

  let allWorkouts = []; // Holds the master list of workouts
  let filteredWorkouts = []; // Holds the list we actually display
  let isLoading = true;
  let activeFilter = 'All'; // To style the active filter button

  onMount(async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'workouts'), where('creatorId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    
    allWorkouts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    filteredWorkouts = allWorkouts; // Initially, show all workouts
    
    isLoading = false;
  });

  // NEW: Function to filter the workouts list
  function applyFilter(filter) {
    activeFilter = filter;
    if (filter === 'All') {
      filteredWorkouts = allWorkouts;
    } else if (filter === 'Benchmark') {
      filteredWorkouts = allWorkouts.filter(w => w.isBenchmark);
    } else {
      // Filter by type (Circuit, AMRAP) or mode (Partner, Individual)
      filteredWorkouts = allWorkouts.filter(w => w.type === filter || w.mode === filter);
    }
  }

  async function deleteWorkout(id) {
    if (!confirm('Are you sure you want to delete this workout?')) return;
    try {
      await deleteDoc(doc(db, 'workouts', id));
      // Remove from both arrays to keep them in sync
      allWorkouts = allWorkouts.filter(w => w.id !== id);
      filteredWorkouts = filteredWorkouts.filter(w => w.id !== id);
    } catch (error) {
      console.error("Error deleting workout: ", error);
      alert("Failed to delete workout.");
    }
  }

  function editWorkout(id) { goto(`/admin/edit/${id}`); }
  function startWorkout(id) { goto(`/timer/${id}`); }
</script>

<div class="page-container">
  <div class="header">
    <h1>My Workouts</h1>
    <a href="/admin/create" class="primary-btn">Create New Workout</a>
  </div>
  
  <div class="filter-controls">
    <span>Filter by:</span>
    <button class:active={activeFilter === 'All'} on:click={() => applyFilter('All')}>All</button>
    <button class:active={activeFilter === 'Benchmark'} on:click={() => applyFilter('Benchmark')}>Benchmark</button>
    <button class:active={activeFilter === 'Circuit'} on:click={() => applyFilter('Circuit')}>Circuit</button>
    <button class:active={activeFilter === 'Partner'} on:click={() => applyFilter('Partner')}>Partner</button>
    <button class:active={activeFilter === 'Individual'} on:click={() => applyFilter('Individual')}>Individual</button>
  </div>

  {#if isLoading}
    <p>Loading your workouts...</p>
  {:else if filteredWorkouts.length === 0}
    <div class="empty-state">
      <p>No workouts match the current filter.</p>
      {#if activeFilter !== 'All'}
        <button class="link-btn" on:click={() => applyFilter('All')}>Clear Filter</button>
      {/if}
    </div>
  {:else}
    <div class="workouts-grid">
      {#each filteredWorkouts as workout}
        <div class="workout-card">
          <div class="card-header">
            <h3>{workout.title}</h3>
            {#if workout.isBenchmark}
              <span class="badge benchmark">★ Benchmark</span>
            {/if}
            <span class="badge {workout.type.toLowerCase()}">{workout.type}</span>
            <span class="badge {workout.mode.toLowerCase()}">{workout.mode}</span>
          </div>
          <p class="notes">{workout.notes || 'No notes for this workout.'}</p>
          <div class="exercise-list">
            <strong>Exercises:</strong>
            <ul>
              {#each workout.exercises as exercise}
                <li>{exercise.name} ({exercise.description})</li>
              {/each}
            </ul>
          </div>
          <div class="card-actions">
            <button class="action-btn edit" on:click={() => editWorkout(workout.id)}>Edit</button>
            <button class="action-btn delete" on:click={() => deleteWorkout(workout.id)}>Delete</button>
            <button class="action-btn start" on:click={() => startWorkout(workout.id)}>Start Session</button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  /* ... (all the previous styles) ... */
  .page-container { width: 100%; max-width: 1200px; margin: 2rem auto; padding: 2rem; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem; }
  h1 { color: var(--yellow); }
  .empty-state { text-align: center; padding: 3rem; background-color: var(--card); border: 1px dashed var(--border-color); border-radius: 16px; color: var(--text-muted); }
  .workouts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1rem; }
  .workout-card { background-color: var(--card); border: 1px solid var(--border-color); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; }
  .card-header { margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
  .card-header h3 { margin-bottom: 0.5rem; }
  .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; margin-right: 0.5rem; margin-top: 0.25rem; text-transform: uppercase; background-color: #333; color: #eee; }
  .badge.circuit { background-color: #059669; }
  .badge.amrap { background-color: #D97706; }
  .badge.emom { background-color: #6D28D9; }
  .badge.partner { background-color: #DB2777; }
  .badge.benchmark { background-color: var(--yellow); color: var(--bg); } /* New style for benchmark */
  .notes { color: var(--text-muted); font-style: italic; margin-bottom: 1rem; flex-grow: 1; }
  .exercise-list ul { list-style-type: none; padding-left: 0; font-size: 0.9rem; }
  .exercise-list li { padding: 0.25rem 0; }
  .card-actions { margin-top: 1.5rem; display: flex; gap: 0.5rem; justify-content: flex-end; }
  .action-btn { border: none; border-radius: 8px; padding: 0.5rem 1rem; cursor: pointer; font-weight: 600; }
  .action-btn.edit { background-color: #2563EB; color: white; }
  .action-btn.delete { background-color: var(--error); color: white; }
  .action-btn.start { background-color: var(--green); color: var(--yellow); flex-grow: 1; }
  .primary-btn { text-decoration: none; }
  .link-btn { background: none; border: none; color: var(--yellow); text-decoration: underline; cursor: pointer; font-size: inherit; margin-top: 1rem; }

  /* New styles for filter controls */
  .filter-controls {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    align-items: center;
    flex-wrap: wrap;
  }
  .filter-controls button {
    background-color: var(--card);
    border: 1px solid var(--border-color);
    color: var(--text-muted);
    padding: 0.5rem 1rem;
    border-radius: 999px;
    cursor: pointer;
  }
  .filter-controls button.active {
    background-color: var(--yellow);
    color: var(--bg);
    border-color: var(--yellow);
    font-weight: bold;
  }
</style>
