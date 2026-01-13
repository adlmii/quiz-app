import { createContext, useContext, useState, useEffect, useRef } from "react";
import { getQuestions } from "../services/api"; 

const QuizContext = createContext();
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export const QuizProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  // State Utama Kuis
  const [quizState, setQuizState] = useState({
    questions: [],
    currentIndex: 0,
    score: 0,
    answers: [], 
    timeLeft: 60, // 60 detik total waktu
    isFinished: false,
    status: 'idle', // idle | playing | finished
  });

  // 1. Load Data dari LocalStorage saat App dibuka (Fitur Resume)
  useEffect(() => {
    const savedUser = localStorage.getItem("quizUser");
    const savedQuiz = localStorage.getItem("quizState");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedQuiz) setQuizState(JSON.parse(savedQuiz));
  }, []);

  // 2. Auto-Save ke LocalStorage setiap kali state berubah
  useEffect(() => {
    if (quizState.status !== 'idle') {
      localStorage.setItem("quizState", JSON.stringify(quizState));
    }
  }, [quizState]);

  // 3. Timer Logic
  useEffect(() => {
    if (quizState.status === 'playing' && quizState.timeLeft > 0) {
      const timer = setInterval(() => {
        setQuizState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearInterval(timer);
    } else if (quizState.timeLeft === 0 && quizState.status === 'playing') {
      finishQuiz(); // Waktu habis
    }
  }, [quizState.timeLeft, quizState.status]);

  // ACTION: Start Quiz (Orchestrator)
  const startQuiz = async () => {
    // Cek 1: Kalau sudah ada soal aktif (Resume), jangan fetch ulang
    if (quizState.questions.length > 0 && !quizState.isFinished) return;

    // Cek 2: Kalau sedang fetching, berhenti di sini
    if (isFetchingRef.current) return;

    // Mulai Fetching
    isFetchingRef.current = true; 
    setLoading(true);
    setError(null);

    try {
      await fetchQuestions();
    } catch (err) {
      console.warn("Percobaan pertama gagal, mencoba lagi dalam 2 detik...");
      // Auto-Retry Logic (Coba sekali lagi)
      setTimeout(async () => {
        try {
          await fetchQuestions();
        } catch (retryErr) {
          setError("Gagal mengambil soal. Koneksi tidak stabil atau API sibuk.");
          setLoading(false);
          isFetchingRef.current = false;
        }
      }, 2000);
    }
  };

  // Internal Helper: Panggil Service & Format Data
  const fetchQuestions = async () => {
    // Panggil Service API (Logic Axios ada di services/api.js)
    const rawQuestions = await getQuestions();

    // Format data agar mudah dipakai di UI
    const formattedQuestions = rawQuestions.map((q) => ({
      question: q.question,
      correct_answer: q.correct_answer,
      options: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
    }));

    // Update State
    setQuizState({
      questions: formattedQuestions,
      currentIndex: 0,
      score: 0,
      answers: [],
      timeLeft: 60,
      isFinished: false,
      status: 'playing',
    });
    
    // Selesai
    setLoading(false);
    isFetchingRef.current = false;
  };

  // ACTION: Jawab Soal
  const answerQuestion = (selectedOption) => {
    const currentQ = quizState.questions[quizState.currentIndex];
    const isCorrect = selectedOption === currentQ.correct_answer;

    setQuizState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      const isEnd = nextIndex >= prev.questions.length;

      return {
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        answers: [...prev.answers, { 
            question: currentQ.question, 
            selected: selectedOption, 
            correct: currentQ.correct_answer, 
            isCorrect 
        }],
        currentIndex: nextIndex,
        isFinished: isEnd,
        status: isEnd ? 'finished' : 'playing',
      };
    });
  };

  // ACTION: Finish Manual (misal Waktu Habis)
  const finishQuiz = () => {
    setQuizState((prev) => ({ ...prev, isFinished: true, status: 'finished' }));
  };

  // ACTION: Login
  const login = (name) => {
    const userData = { name };
    setUser(userData);
    localStorage.setItem("quizUser", JSON.stringify(userData));
  };

  // ACTION: Logout / Reset Total
  const logout = () => {
    setUser(null);
    setQuizState({ 
        questions: [], 
        currentIndex: 0, 
        score: 0, 
        answers: [], 
        timeLeft: 60, 
        isFinished: false, 
        status: 'idle' 
    });
    localStorage.removeItem("quizUser");
    localStorage.removeItem("quizState");
    isFetchingRef.current = false; 
  };

  return (
    <QuizContext.Provider value={{ user, quizState, loading, error, login, logout, startQuiz, answerQuestion }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);