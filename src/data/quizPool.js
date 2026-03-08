// Default question pool used by QuizPhase when no room-specific questions are provided.
export const defaultQuizPool = [
  { q: "What is 'blue' in Spanish?", level: "entry", subject: "Spanish", options: [{ label: "Azul", correct: true }, { label: "Rojo", correct: false }, { label: "Verde", correct: false }] },
  { q: "What is 'yellow' in Welsh?", level: "entry", subject: "Welsh", options: [{ label: "Melyn", correct: true }, { label: "Du", correct: false }, { label: "Glas", correct: false }] },
  { q: "Translate 'apple' to Spanish.", level: "ks3", subject: "Spanish", options: [{ label: "Manzana", correct: true }, { label: "Pera", correct: false }, { label: "Uva", correct: false }] },
  { q: "What is 'cat' in Spanish?", level: "entry", subject: "Spanish", options: [{ label: "Gato", correct: true }, { label: "Perro", correct: false }, { label: "Caballo", correct: false }] },
  { q: "What is 'black' in Welsh?", level: "entry", subject: "Welsh", options: [{ label: "Du", correct: true }, { label: "Glas", correct: false }, { label: "Gwyn", correct: false }] },
  { q: "Translate 'house' to Spanish.", level: "ks3", subject: "Spanish", options: [{ label: "Casa", correct: true }, { label: "Carro", correct: false }, { label: "Mesa", correct: false }] },
  { q: "How do you say 'book' in Welsh?", level: "ks3", subject: "Welsh", options: [{ label: "Llyfr", correct: true }, { label: "Cadair", correct: false }, { label: "Dwr", correct: false }] },
  { q: "What is 'please' in Spanish?", level: "ks3", subject: "Spanish", options: [{ label: "Por favor", correct: true }, { label: "Buenos días", correct: false }, { label: "Gracias", correct: false }] },
];

// Extra questions used to pad the pool to at least 6 when fewer are available.
export const extraQuizPool = [
  { q: "How do you say 'hello' in Welsh?", level: "entry", subject: "Welsh", options: [{ label: "Helo", correct: true }, { label: "Diolch", correct: false }, { label: "Hwyl", correct: false }] },
  { q: "Translate 'school' to Welsh.", level: "ks3", subject: "Welsh", options: [{ label: "Ysgol", correct: true }, { label: "Ty", correct: false }, { label: "Bws", correct: false }] },
  { q: "What is 'red' in Spanish?", level: "entry", subject: "Spanish", options: [{ label: "Rojo", correct: true }, { label: "Negro", correct: false }, { label: "Verde", correct: false }] },
  { q: "How do you say 'goodbye' in Welsh?", level: "entry", subject: "Welsh", options: [{ label: "Hwyl fawr", correct: true }, { label: "Nos da", correct: false }, { label: "Croeso", correct: false }] },
];

export const quizPool = {
  languages: {
    room2: [
      {
        question: "What is the Spanish word for 'red'?",
        level: "entry",
        subject: "Spanish",
        options: [
          { label: 'Rojo', correct: true },
          { label: 'Azul', correct: false },
          { label: 'Verde', correct: false },
          { label: 'Negro', correct: false },
        ],
      },
      {
        question: "What does 'feliz' mean in Spanish?",
        level: "ks3",
        subject: "Spanish",
        options: [
          { label: 'Sad', correct: false },
          { label: 'Happy', correct: true },
          { label: 'Tired', correct: false },
          { label: 'Angry', correct: false },
        ],
      },
      {
        question: "What is the Spanish word for 'Monday'?",
        level: "ks3",
        subject: "Spanish",
        options: [
          { label: 'Lunes', correct: true },
          { label: 'Martes', correct: false },
          { label: 'Jueves', correct: false },
          { label: 'Domingo', correct: false },
        ],
      },
    ],
    rocheBoss: [
      {
        q: "What is the Spanish word for 'yellow'?",
        level: "entry",
        subject: "Spanish",
        options: [
          { label: 'Amarillo', correct: true },
          { label: 'Rojo', correct: false },
          { label: 'Verde', correct: false },
          { label: 'Gris', correct: false },
        ],
      },
      {
        q: "How do you say 'thank you' in Welsh?",
        level: "ks3",
        subject: "Welsh",
        options: [
          { label: 'Diolch', correct: true },
          { label: 'Croeso', correct: false },
          { label: 'Hwyl', correct: false },
          { label: 'Cymru', correct: false },
        ],
      },
      {
        q: "Translate 'blue' to Spanish:",
        level: "entry",
        subject: "Spanish",
        options: [
          { label: 'Azul', correct: true },
          { label: 'Negro', correct: false },
          { label: 'Rosa', correct: false },
          { label: 'Blanco', correct: false },
        ],
      },
      {
        q: "What does 'nos da' mean in Welsh?",
        level: "ks3",
        subject: "Welsh",
        options: [
          { label: 'Good night', correct: true },
          { label: 'Good morning', correct: false },
          { label: 'Hello', correct: false },
          { label: 'Goodbye', correct: false },
        ],
      },
      {
        q: "How do you say 'dog' in Spanish?",
        level: "entry",
        subject: "Spanish",
        options: [
          { label: 'Perro', correct: true },
          { label: 'Gato', correct: false },
          { label: 'Caballo', correct: false },
          { label: 'Vaca', correct: false },
        ],
      },
      {
        q: "What is the Welsh word for 'school'?",
        level: "ks3",
        subject: "Welsh",
        options: [
          { label: 'Ysgol', correct: true },
          { label: 'Cartref', correct: false },
          { label: 'Bws', correct: false },
          { label: 'Cwch', correct: false },
        ],
      },
      {
        q: "How do you say 'I like' in Spanish?",
        level: "ks4",
        subject: "Spanish",
        options: [
          { label: 'Me gusta', correct: true },
          { label: 'Me llamo', correct: false },
          { label: 'Tengo', correct: false },
          { label: 'Quiero', correct: false },
        ],
      },
      {
        q: "What does 'bore da' mean in Welsh?",
        level: "ks4",
        subject: "Welsh",
        options: [
          { label: 'Good morning', correct: true },
          { label: 'Good night', correct: false },
          { label: 'Good afternoon', correct: false },
          { label: 'Goodbye', correct: false },
        ],
      },
    ],
  },
};

export default quizPool;
