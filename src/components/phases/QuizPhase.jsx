import React, { useState } from "react";
import { playSound } from "../../utils";
import { defaultQuizPool, extraQuizPool } from "../../data/quizPool";
import "../styles/Quiz.css";

const MIN_QUESTIONS = 6;
const STREAK_UP = 5;   // consecutive correct answers needed to raise level
const STREAK_DOWN = 3; // consecutive wrong answers needed to lower level

const LEVELS = ["entry", "ks3", "ks4"];

// ALN-appropriate encouragement instead of physical penalties
const WRONG_FEEDBACK = [
  "Not quite — have another look at the options!",
  "That one's tricky. Keep going!",
  "Mistakes help us learn — you've got the next one!",
  "Take a breath and try the next question.",
  "Close! Read the choices carefully next time.",
];

const IMPOSSIBLE_FINAL_QUESTION = {
  q: "Translate 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch' into English:",
  options: [
    { label: "Yes", correct: false },
    { label: "No", correct: false },
    { label: "What did you just say?", correct: false },
    { label: "I give up", correct: false },
  ],
};

// Exercise challenges TITAN can assign when a quiz is failed
const FALLBACK_EXERCISES = [
  "30 squats",
  "20 press-ups",
  "15 burpees",
  "40 jumping jacks",
  "20 lunges (10 each leg)",
  "30-second wall sit",
  "15 tuck jumps",
  "20 mountain climbers",
];

function lowerLevel(level) {
  const idx = LEVELS.indexOf(level);
  return LEVELS[Math.max(0, idx - 1)];
}

function higherLevel(level) {
  const idx = LEVELS.indexOf(level);
  return LEVELS[Math.min(LEVELS.length - 1, idx + 1)];
}

// Normalize question to always have a `q` key
function normalize(q) {
  return { ...q, q: q.q || q.question };
}

function buildPool(questions) {
  let pool =
    Array.isArray(questions) && questions.length > 0
      ? questions.map(normalize)
      : defaultQuizPool.map(normalize);

  // Pad to MIN_QUESTIONS if needed
  let extraIndex = 0;
  while (pool.length < MIN_QUESTIONS) {
    pool.push(normalize(extraQuizPool[extraIndex % extraQuizPool.length]));
    extraIndex += 1;
  }
  return pool;
}

function pickQuestion(pool, level, askedKeys) {
  // Prefer questions at current level that haven't been asked
  const atLevel = pool.filter(
    (q) => q.level === level && !askedKeys.has(q.q)
  );
  if (atLevel.length > 0) {
    return atLevel[Math.floor(Math.random() * atLevel.length)];
  }
  // Fall back to any unasked question
  const remaining = pool.filter((q) => !askedKeys.has(q.q));
  if (remaining.length > 0) {
    return remaining[Math.floor(Math.random() * remaining.length)];
  }
  // All questions asked — pick any at current level, then any
  const anyAtLevel = pool.filter((q) => q.level === level);
  if (anyAtLevel.length > 0) {
    return anyAtLevel[Math.floor(Math.random() * anyAtLevel.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function QuizPhase({
  questions = [],
  onComplete,
  showImpossibleFinal = false,
  studentLevel = "entry",
}) {
  const [pool] = useState(() => buildPool(questions));
  const totalQuestions = showImpossibleFinal ? MIN_QUESTIONS + 1 : MIN_QUESTIONS;

  const [currentLevel, setCurrentLevel] = useState(studentLevel);
  const [askedKeys, setAskedKeys] = useState(new Set());
  const [currentQuestion, setCurrentQuestion] = useState(() =>
    pickQuestion(buildPool(questions), studentLevel, new Set())
  );
  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [levelNotice, setLevelNotice] = useState("");
  const [finalWrong, setFinalWrong] = useState(false);
  const [finalLevel, setFinalLevel] = useState(studentLevel);

  // TITAN exercise fallback state
  const [fallbackExercise] = useState(
    () => FALLBACK_EXERCISES[Math.floor(Math.random() * FALLBACK_EXERCISES.length)]
  );
  const [exerciseDone, setExerciseDone] = useState(false);

  const isOnImpossibleFinal =
    showImpossibleFinal && questionNumber === MIN_QUESTIONS + 1;

  const handleAnswer = (option) => {
    const isCorrect = !!option.correct;
    const qKey = currentQuestion.q;

    // Update asked set
    const newAsked = new Set(askedKeys);
    newAsked.add(qKey);
    setAskedKeys(newAsked);

    let newLevel = currentLevel;
    let newCorrectStreak = correctStreak;
    let newWrongStreak = wrongStreak;

    if (isCorrect) {
      playSound("correct");
      setCorrectAnswers((c) => c + 1);
      setFeedback("");
      newCorrectStreak = correctStreak + 1;
      newWrongStreak = 0;

      if (newCorrectStreak >= STREAK_UP) {
        const bumped = higherLevel(currentLevel);
        if (bumped !== currentLevel) {
          newLevel = bumped;
          setLevelNotice(`Great streak! Moving to ${bumped.toUpperCase()} questions.`);
          setTimeout(() => setLevelNotice(""), 3000);
        }
        newCorrectStreak = 0;
      }
    } else {
      // Impossible final: narrative flavour, no feedback
      if (isOnImpossibleFinal) {
        setFinalWrong(true);
      } else {
        const msg =
          WRONG_FEEDBACK[Math.floor(Math.random() * WRONG_FEEDBACK.length)];
        setFeedback(msg);
        setTimeout(() => setFeedback(""), 3500);
      }
      newWrongStreak = wrongStreak + 1;
      newCorrectStreak = 0;

      if (newWrongStreak >= STREAK_DOWN) {
        const dropped = lowerLevel(currentLevel);
        if (dropped !== currentLevel) {
          newLevel = dropped;
          setLevelNotice(`Dropping to ${dropped.toUpperCase()} questions — keep going!`);
          setTimeout(() => setLevelNotice(""), 3000);
        }
        newWrongStreak = 0;
      }
    }

    setCorrectStreak(newCorrectStreak);
    setWrongStreak(newWrongStreak);

    if (newLevel !== currentLevel) {
      setCurrentLevel(newLevel);
      setFinalLevel(newLevel);
    }

    const nextNumber = questionNumber + 1;

    if (nextNumber > totalQuestions) {
      setQuizComplete(true);
      playSound("monsterRoar");
      return;
    }

    setQuestionNumber(nextNumber);

    if (showImpossibleFinal && nextNumber === MIN_QUESTIONS + 1) {
      setCurrentQuestion(IMPOSSIBLE_FINAL_QUESTION);
    } else {
      const next = pickQuestion(pool, newLevel, newAsked);
      setCurrentQuestion(next);
    }
  };

  const handleReset = () => {
    const freshPool = buildPool(questions);
    setCurrentLevel(studentLevel);
    setFinalLevel(studentLevel);
    setAskedKeys(new Set());
    setCurrentQuestion(pickQuestion(freshPool, studentLevel, new Set()));
    setQuestionNumber(1);
    setCorrectAnswers(0);
    setCorrectStreak(0);
    setWrongStreak(0);
    setQuizComplete(false);
    setFeedback("");
    setLevelNotice("");
    setFinalWrong(false);
    setExerciseDone(false);
  };

  const levelLabel =
    currentLevel === "entry"
      ? "Entry"
      : currentLevel === "ks3"
      ? "KS3"
      : "KS4";

  if (quizComplete) {
    // Don't count the impossible final question toward pass/fail
    const answerableTotal = showImpossibleFinal ? MIN_QUESTIONS : totalQuestions;
    const passed = correctAnswers >= Math.ceil(answerableTotal / 2);

    // Failed quiz — TITAN offers an exercise challenge to force the door open
    if (!passed && !exerciseDone) {
      return (
        <div className="quiz-container">
          <h2>📡 TITAN Transmission</h2>
          <p>
            You answered {correctAnswers} out of {answerableTotal} correctly.
          </p>
          <p className="quiz-titan-msg">
            "You didn't crack the code this time, but I can override the lock.
            Complete this challenge to prove your strength, and I'll force the
            door open for you."
          </p>
          <p className="quiz-fallback-exercise">{fallbackExercise}</p>
          <button
            className="quiz-fallback-done-btn"
            onClick={() => setExerciseDone(true)}
          >
            I've done it!
          </button>
          <button className="quiz-option-btn retry" onClick={handleReset}>
            Retry Quiz Instead
          </button>
        </div>
      );
    }

    // Exercise done — TITAN override success
    if (!passed && exerciseDone) {
      return (
        <div className="quiz-container">
          <h2>📡 TITAN Override</h2>
          <p className="quiz-titan-msg">
            "Override successful. You've earned your way through — the door is
            open. Keep moving."
          </p>
          {finalWrong && (
            <p>
              A mutated figure charges at you! You dive aside as it smashes the
              door open.
            </p>
          )}
          <button onClick={() => onComplete(correctAnswers, totalQuestions, finalLevel)}>
            Continue
          </button>
        </div>
      );
    }

    // Passed quiz — normal completion
    return (
      <div className="quiz-container">
        <h2>🎉 Quiz Complete</h2>
        <p>
          You answered {correctAnswers} out of {totalQuestions} correctly.
        </p>
        {finalWrong && (
          <p>
            A mutated figure charges at you! You dive aside as it smashes the
            door open.
          </p>
        )}
        <button onClick={() => onComplete(correctAnswers, totalQuestions, finalLevel)}>
          Continue
        </button>
        {correctAnswers < totalQuestions && (
          <button className="quiz-option-btn retry" onClick={handleReset}>
            Retry from Start
          </button>
        )}
      </div>
    );
  }

  const displayQuestion = isOnImpossibleFinal
    ? IMPOSSIBLE_FINAL_QUESTION
    : currentQuestion;

  return (
    <div className="quiz-container">
      <div className="quiz-header-row">
        <h2>📖 The Quiz</h2>
        <span className="quiz-level-badge">Level: {levelLabel}</span>
        <span className="quiz-progress">
          {questionNumber} / {totalQuestions}
        </span>
      </div>
      <p className="quiz-question">{displayQuestion.q}</p>
      <div className="quiz-options">
        {displayQuestion.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(opt)}
            className="quiz-option-btn"
          >
            {opt.label}
          </button>
        ))}
      </div>
      {feedback && <p className="penalty-message">{feedback}</p>}
      {levelNotice && <p className="level-notice">{levelNotice}</p>}
    </div>
  );
}

export default QuizPhase;
