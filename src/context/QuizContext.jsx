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
    timeLeft: 60, 
    isFinished: false,
    status: 'idle', 
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("quizUser");
    const savedQuiz = localStorage.getItem("quizState");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedQuiz) setQuizState(JSON.parse(savedQuiz));
  }, []);

  useEffect(() => {
    if (quizState.status !== 'idle') {
      localStorage.setItem("quizState", JSON.stringify(quizState));
    }
  }, [quizState]);

  useEffect(() => {
    if (quizState.status === 'playing' && quizState.timeLeft > 0) {
      const timer = setInterval(() => {
        setQuizState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearInterval(timer);
    } else if (quizState.timeLeft === 0 && quizState.status === 'playing') {
      finishQuiz();
    }
  }, [quizState.timeLeft, quizState.status]);

  // --- BAGIAN YANG DIPERBAIKI ---
  const startQuiz = async () => {
    // 1. Cek Resume (kalau soal ada & belum selesai, jangan reset)
    if (quizState.questions.length > 0 && !quizState.isFinished) return;

    if (isFetchingRef.current) return;

    isFetchingRef.current = true; 
    setLoading(true);
    setError(null);

    // FIX: Reset status SEGERA agar tidak mental balik ke Result page
    setQuizState(prev => ({ 
      ...prev, 
      isFinished: false, 
      score: 0, 
      answers: [],
      currentIndex: 0 
    }));

    try {
      await fetchQuestions();
    } catch (err) {
      console.warn("Retrying fetch...");
      setTimeout(async () => {
        try {
          await fetchQuestions();
        } catch (retryErr) {
          setError("Gagal mengambil soal. Cek koneksi internetmu.");
          setLoading(false);
          isFetchingRef.current = false;
        }
      }, 2000);
    }
  };

  const fetchQuestions = async () => {
    const rawQuestions = await getQuestions();

    const formattedQuestions = rawQuestions.map((q) => ({
      question: q.question,
      correct_answer: q.correct_answer,
      options: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
    }));

    setQuizState({
      questions: formattedQuestions,
      currentIndex: 0,
      score: 0,
      answers: [],
      timeLeft: 60,
      isFinished: false,
      status: 'playing',
    });
    
    setLoading(false);
    isFetchingRef.current = false;
  };

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

  const finishQuiz = () => {
    setQuizState((prev) => ({ ...prev, isFinished: true, status: 'finished' }));
  };

  const login = (name) => {
    const userData = { name };
    setUser(userData);
    localStorage.setItem("quizUser", JSON.stringify(userData));
  };

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