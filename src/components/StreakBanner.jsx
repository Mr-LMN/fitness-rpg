import React, { useMemo } from 'react';
import narrationLines from '../data/narrationLines';
import { getReadingProfile } from '../helpers/readingProfile';
import { adaptSingleLine } from '../helpers/narrativeAdapter';

/**
 * Calculates login streak from localStorage.
 * Stores: { dates: ["2026-03-01", ...], lastLogin: "2026-03-01" }
 */
export function getStreakData() {
  try {
    const raw = JSON.parse(localStorage.getItem('streakData') || '{}');
    return { streak: raw.streak || 0, lastLogin: raw.lastLogin || null };
  } catch {
    return { streak: 0, lastLogin: null };
  }
}

export function updateStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const data = getStreakData();

  if (data.lastLogin === today) return data; // Already logged today

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let newStreak;

  if (data.lastLogin === yesterday) {
    newStreak = data.streak + 1; // Consecutive day
  } else if (!data.lastLogin) {
    newStreak = 1; // First login ever
  } else {
    newStreak = 1; // Streak broken
  }

  const newData = { streak: newStreak, lastLogin: today };
  localStorage.setItem('streakData', JSON.stringify(newData));
  return newData;
}

const MILESTONE_KEYS = [3, 7, 14, 30];

function StreakBanner({ streak, readingAge = 'not-sure', onDismiss }) {
  const profile = getReadingProfile(readingAge);

  const message = useMemo(() => {
    // Check for milestone messages
    const milestones = narrationLines.dailyStreak?.streakMilestones || {};
    if (milestones[streak]) {
      return adaptSingleLine(milestones[streak], profile);
    }
    // Default welcome message
    return adaptSingleLine(narrationLines.dailyStreak?.welcome, profile);
  }, [streak, profile]);

  const isMilestone = MILESTONE_KEYS.includes(streak);

  if (!message) return null;

  return (
    <div className={`streak-banner ${isMilestone ? 'streak-milestone' : ''}`}>
      <div className="streak-banner-inner">
        <div className="streak-flame-count">
          <span className="streak-flame" role="img" aria-label="streak">
            {streak >= 7 ? '\u{1F525}' : '\u{2B50}'}
          </span>
          <span className="streak-number">{streak}-Day Streak</span>
        </div>
        <p className="streak-message">{message}</p>
        <button className="streak-dismiss" onClick={onDismiss}>Continue</button>
      </div>
    </div>
  );
}

export default StreakBanner;
