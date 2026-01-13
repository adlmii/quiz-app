import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import QuestionCard from "../components/QuestionCard";
import { Clock, Loader2 } from "lucide-react";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Quiz() {
  const { user, quizState, startQuiz, answerQuestion, loading, error } = useQuiz();
  const navigate = useNavigate();

  const title = quizState.questions.length > 0 
    ? `Question ${quizState.currentIndex + 1}/${quizState.questions.length} | Time: ${quizState.timeLeft}s` 
    : "Loading Quiz...";
    
  useDocumentTitle(title);

  // Proteksi Halaman
  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  // Fetch / Resume Logic
  useEffect(() => {
    if (user && quizState.status === 'idle') {
      startQuiz();
    }
  }, [user, quizState.status]);

  // Cek Finish
  useEffect(() => {
    if (quizState.isFinished) {
      navigate("/result");
    }
  }, [quizState.isFinished, navigate]);

  // Loading Screen (Tema Hijau)
  if (loading || !quizState.questions.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <Loader2 size={48} className="animate-spin text-emerald-600 mb-4" />
        <p className="text-gray-500 animate-pulse">Menyiapkan soal untukmu, {user?.name}...</p>
      </div>
    );
  }

  // Error Screen
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-center">
        <div className="max-w-md p-6">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Coba Lagi</button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      {/* Header Bersih (Tanpa Logout) */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-10 border-b border-emerald-100">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-linear-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold shadow-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="font-bold text-gray-700">{user?.name}</span>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono font-bold transition-colors shadow-sm border border-gray-100 ${quizState.timeLeft < 10 ? "bg-red-50 text-red-600 animate-pulse border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>
            <Clock size={18} />
            <span>{quizState.timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-20 flex justify-center">
        {currentQuestion && (
          <QuestionCard
            data={currentQuestion}
            currentIndex={quizState.currentIndex}
            totalQuestions={quizState.questions.length}
            onAnswer={answerQuestion}
          />
        )}
      </div>
    </div>
  );
}