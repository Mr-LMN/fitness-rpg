// Default question pool used by QuizPhase when no room-specific questions are provided.
export const defaultQuizPool = [
  { q: "What is 'blue' in Spanish?", options: [{ label: "Azul", correct: true }, { label: "Rojo", correct: false }, { label: "Verde", correct: false }] },
  { q: "What is 'yellow' in Welsh?", options: [{ label: "Melyn", correct: true }, { label: "Du", correct: false }, { label: "Glas", correct: false }] },
  { q: "Translate 'apple' to Spanish.", options: [{ label: "Manzana", correct: true }, { label: "Pera", correct: false }, { label: "Uva", correct: false }] },
  { q: "What is 'cat' in Spanish?", options: [{ label: "Gato", correct: true }, { label: "Perro", correct: false }, { label: "Caballo", correct: false }] },
  { q: "What is 'black' in Welsh?", options: [{ label: "Du", correct: true }, { label: "Glas", correct: false }, { label: "Gwyn", correct: false }] },
  { q: "Translate 'house' to Spanish.", options: [{ label: "Casa", correct: true }, { label: "Carro", correct: false }, { label: "Mesa", correct: false }] },
  { q: "How do you say 'book' in Welsh?", options: [{ label: "Llyfr", correct: true }, { label: "Cadair", correct: false }, { label: "Dwr", correct: false }] },
  { q: "What is 'please' in Spanish?", options: [{ label: "Por favor", correct: true }, { label: "Buenos días", correct: false }, { label: "Gracias", correct: false }] },
];

// Extra questions used to pad the pool to at least 6 when fewer are available.
export const extraQuizPool = [
  { q: "How do you say 'hello' in Welsh?", options: [{ label: "Helo", correct: true }, { label: "Diolch", correct: false }, { label: "Hwyl", correct: false }] },
  { q: "Translate 'school' to Welsh.", options: [{ label: "Ysgol", correct: true }, { label: "Ty", correct: false }, { label: "Bws", correct: false }] },
  { q: "What is 'red' in Spanish?", options: [{ label: "Rojo", correct: true }, { label: "Negro", correct: false }, { label: "Verde", correct: false }] },
  { q: "How do you say 'goodbye' in Welsh?", options: [{ label: "Hwyl fawr", correct: true }, { label: "Nos da", correct: false }, { label: "Croeso", correct: false }] },
];

export const quizPool = {
  languages: {
    room2: [
      {
        question: "What is the Spanish word for 'red'?",
        options: [
          { label: 'Rojo', correct: true },
          { label: 'Azul', correct: false },
          { label: 'Verde', correct: false },
          { label: 'Negro', correct: false },
        ],
      },
      {
        question: "What does 'feliz' mean in Spanish?",
        options: [
          { label: 'Sad', correct: false },
          { label: 'Happy', correct: true },
          { label: 'Tired', correct: false },
          { label: 'Angry', correct: false },
        ],
      },
      {
        question: "What is the Spanish word for 'Monday'?",
        options: [
          { label: 'Lunes', correct: true },
          { label: 'Martes', correct: false },
          { label: 'Jueves', correct: false },
          { label: 'Domingo', correct: false },
        ],
      },
      {
        question: "Translate 'verde' to English:",
        options: [
          { label: 'Green', correct: true },
          { label: 'Blue', correct: false },
          { label: 'Yellow', correct: false },
          { label: 'Orange', correct: false },
        ],
      },
    ],
    rocheBoss: [
      {
        q: "What is the Spanish word for 'yellow'?",
        options: [
          { label: 'Amarillo', correct: true },
          { label: 'Rojo', correct: false },
          { label: 'Verde', correct: false },
          { label: 'Gris', correct: false },
        ],
      },
      {
        q: "How do you say 'thank you' in Welsh?",
        options: [
          { label: 'Diolch', correct: true },
          { label: 'Croeso', correct: false },
          { label: 'Hwyl', correct: false },
          { label: 'Cymru', correct: false },
        ],
      },
      {
        q: "Translate 'blue' to Spanish:",
        options: [
          { label: 'Azul', correct: true },
          { label: 'Negro', correct: false },
          { label: 'Rosa', correct: false },
          { label: 'Blanco', correct: false },
        ],
      },
      {
        q: "What does 'nos da' mean in Welsh?",
        options: [
          { label: 'Good night', correct: true },
          { label: 'Good morning', correct: false },
          { label: 'Hello', correct: false },
          { label: 'Goodbye', correct: false },
        ],
      },
      {
        q: "How do you say 'dog' in Spanish?",
        options: [
          { label: 'Perro', correct: true },
          { label: 'Gato', correct: false },
          { label: 'Caballo', correct: false },
          { label: 'Vaca', correct: false },
        ],
      },
      {
        q: "What is the Welsh word for 'school'?",
        options: [
          { label: 'Ysgol', correct: true },
          { label: 'Cartref', correct: false },
          { label: 'Bws', correct: false },
          { label: 'Cwch', correct: false },
        ],
      },
    ],
  },
};

export default quizPool;
