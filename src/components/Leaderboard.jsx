import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';
import './styles/Leaderboard.css';

function Leaderboard({ yearGroup }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'workouts'),
      where('yearGroup', '==', yearGroup),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    const unsubscribe = onSnapshot(q, snap => {
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEntries(data);
    });
    return unsubscribe;
  }, [yearGroup]);

  return (
    <div className="leaderboard-container">
      <h2>Year {yearGroup} Leaderboard</h2>
      <ol>
        {entries.map(e => (
          <li key={e.id}>
            {e.userId}: {e.workoutType || e.type} — {e.caloriesBurned || e.totalWeightLifted}
          </li>
        ))}
      </ol>
    </div>
  );
}
export default Leaderboard;
