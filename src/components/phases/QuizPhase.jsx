diff --git a/src/components/phases/QuizPhase.jsx b/src/components/phases/QuizPhase.jsx
index aa89b3305fe6f358a4d06884b10ac31e523eddf6..0b265cb04c7ea2ee806f81693d213e653bc1c8de 100644
--- a/src/components/phases/QuizPhase.jsx
+++ b/src/components/phases/QuizPhase.jsx
@@ -1,105 +1,115 @@
-import { useState } from "react";
+import { useState, useMemo } from "react";
 
 function QuizPhase({ questions, onComplete, showImpossibleFinal = false }) {
   const [currentQuestion, setCurrentQuestion] = useState(0);
   const [correctAnswers, setCorrectAnswers] = useState(0);
   const [quizComplete, setQuizComplete] = useState(false);
 
   const defaultPool = [
     {
       q: "What is 'blue' in Spanish?",
       options: [
         { label: "Azul", correct: true },
         { label: "Rojo", correct: false },
         { label: "Verde", correct: false },
       ],
     },
     {
       q: "What is 'yellow' in Welsh?",
       options: [
         { label: "Melyn", correct: true },
         { label: "Du", correct: false },
         { label: "Glas", correct: false },
       ],
     },
     {
       q: "Translate 'apple' to Spanish.",
       options: [
         { label: "Manzana", correct: true },
         { label: "Pera", correct: false },
         { label: "Uva", correct: false },
       ],
     },
     {
       q: "What is 'cat' in Spanish?",
       options: [
         { label: "Gato", correct: true },
         { label: "Perro", correct: false },
         { label: "Caballo", correct: false },
       ],
     },
     {
       q: "What is 'black' in Welsh?",
       options: [
         { label: "Du", correct: true },
         { label: "Glas", correct: false },
         { label: "Gwyn", correct: false },
       ],
     },
   ];
 
-  const questionPool = questions && questions.length > 0 ? questions : defaultPool;
-  const totalQuestions = showImpossibleFinal ? questionPool.length + 1 : questionPool.length;
+  const questionPool = useMemo(() => {
+    const pool = Array.isArray(questions) && questions.length > 0 ? [...questions] : [...defaultPool];
+    if (showImpossibleFinal) {
+      pool.push({
+        q: "Translate 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch' into English:",
+        options: [
+          { label: "Yes", correct: false },
+          { label: "No", correct: false },
+          { label: "What did you just say?", correct: false },
+          { label: "I give up", correct: false },
+        ],
+      });
+    }
+    return pool;
+  }, [questions, showImpossibleFinal]);
+
+  const totalQuestions = questionPool.length;
 
   const handleAnswer = (option) => {
-    if (currentQuestion < questionPool.length && option.correct) {
-      setCorrectAnswers((prev) => prev + 1);
-    }
+    const isCorrect =
+      currentQuestion < questionPool.length && option.correct;
+    const updatedCorrect = isCorrect
+      ? correctAnswers + 1
+      : correctAnswers;
 
     const nextQuestion = currentQuestion + 1;
     if (nextQuestion === totalQuestions) {
+      setCorrectAnswers(updatedCorrect);
       setQuizComplete(true);
-      onComplete(correctAnswers);
     } else {
+      setCorrectAnswers(updatedCorrect);
       setCurrentQuestion(nextQuestion);
     }
   };
 
   if (quizComplete) {
     return (
       <div className="quiz-container">
         <h2>🎉 Quiz Complete</h2>
         <p>You answered {correctAnswers} questions correctly.</p>
         <button onClick={() => onComplete(correctAnswers)}>Continue</button>
       </div>
     );
   }
 
-  const current = currentQuestion < questionPool.length
-    ? questionPool[currentQuestion]
-    : {
-        q: "Translate 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch' into English:",
-        options: [
-          { label: "Yes", correct: false },
-          { label: "No", correct: false },
-          { label: "What did you just say?", correct: false },
-          { label: "I give up", correct: false },
-        ],
-      };
+  const current = questionPool[currentQuestion];
+
+  const questionText = current.question || current.q || current.text || "";
 
   return (
     <div className="quiz-container">
       <h2>📖 The Quiz</h2>
-      <p className="quiz-question">{current.q}</p>
+      <p className="quiz-question">{questionText}</p>
       <div className="quiz-options">
         {current.options.map((option, index) => (
           <button key={index} onClick={() => handleAnswer(option)} className="quiz-option-btn">
             {option.label}
           </button>
         ))}
       </div>
     </div>
   );
 }
 
 export default QuizPhase;

