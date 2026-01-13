import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { 
  Check, 
  X, 
  RefreshCw, 
  LogOut, 
  ListChecks, 
  SmilePlus,
  Smile,
  Meh,
  Frown
} from "lucide-react";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Result() {
  const { user, quizState, logout, startQuiz } = useQuiz();
  const navigate = useNavigate();

  useDocumentTitle(`Result: ${quizState.score} Correct | DOT Quiz`);

  // Proteksi Halaman
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (!quizState.isFinished) {
      navigate("/quiz");
    }
  }, [user, quizState.isFinished, navigate]);

  // --- LOGIKA PERHITUNGAN ---
  const totalQuestions = quizState.questions.length;
  const totalAnswered = quizState.answers.length;
  const correctAnswers = quizState.score;
  const wrongAnswers = totalAnswered - correctAnswers;
  
  const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Konfigurasi Tampilan
  const getResultConfig = () => {
    if (scorePercentage === 100) {
      return {
        title: "Sempurna!",
        desc: "Luar biasa! Kamu menjawab semua dengan benar.",
        color: "text-emerald-600",
        bgIcon: "bg-emerald-100",
        icon: <SmilePlus className="text-emerald-600 w-10 h-10 md:w-14 md:h-14" />, // Icon responsif
      };
    } else if (scorePercentage >= 80) {
      return {
        title: "Sangat Bagus!",
        desc: "Hasil kerjamu sangat memuaskan.",
        color: "text-teal-600",
        bgIcon: "bg-teal-100",
        icon: <Smile className="text-teal-600 w-10 h-10 md:w-14 md:h-14" />,
      };
    } else if (scorePercentage >= 50) {
      return {
        title: "Cukup Baik",
        desc: "Kamu lulus, tapi masih bisa ditingkatkan.",
        color: "text-blue-600",
        bgIcon: "bg-blue-100",
        icon: <Meh className="text-blue-600 w-10 h-10 md:w-14 md:h-14" />,
      };
    } else {
      return {
        title: "Perlu Latihan",
        desc: "Jangan menyerah. Coba lagi ya!",
        color: "text-red-600",
        bgIcon: "bg-red-100",
        icon: <Frown className="text-red-600 w-10 h-10 md:w-14 md:h-14" />,
      };
    }
  };

  const config = getResultConfig();

  const handlePlayAgain = async () => {
    await startQuiz();
    navigate("/quiz");
  };

  const handleLogout = () => {
    if (window.confirm("Yakin mau mengakhiri sesi ini?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 md:py-12">
      {/* CONTAINER UTAMA: 
         - Mobile: max-w-md (standar)
         - Desktop: max-w-lg (lebih lebar biar lega)
      */}
      <div className="w-full max-w-md md:max-w-lg animate-fade-in rounded-3xl bg-white p-6 md:p-10 shadow-xl border-t-8 border-emerald-500">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-10">
          {/* Bubble Icon: Ukuran menyesuaikan layar */}
          <div className={`mb-4 flex h-20 w-20 md:h-28 md:w-28 items-center justify-center rounded-full ${config.bgIcon} shadow-sm transition-all`}>
            {config.icon}
          </div>
          
          {/* Typography Responsif */}
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{scorePercentage}%</h1>
          <h2 className={`text-xl md:text-2xl font-bold ${config.color} mt-2`}>{config.title}</h2>
          <p className="mt-2 text-sm md:text-base text-gray-500 leading-relaxed max-w-xs mx-auto">
            {config.desc}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 md:h-4 bg-gray-100 rounded-full mb-8 md:mb-10 overflow-hidden shadow-inner">
           <div 
             className={`h-full rounded-full transition-all duration-1000 ${scorePercentage >= 60 ? 'bg-emerald-500' : 'bg-red-500'}`} 
             style={{ width: `${scorePercentage}%` }}
           ></div>
        </div>

        {/* --- STATISTIK GRID (OPTIMIZED) --- */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-10">
          
          {/* 1. DIJAWAB */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-blue-50 p-3 md:p-6 border border-blue-100">
            {/* Icon Bubble */}
            <div className="mb-2 md:mb-3 flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
              <ListChecks className="w-4 h-4 md:w-6 md:h-6" />
            </div>
            {/* Angka Besar */}
            <p className="text-xl md:text-3xl font-black text-gray-800">
              {totalAnswered}<span className="text-xs md:text-sm font-medium text-gray-400">/{totalQuestions}</span>
            </p>
            {/* Label */}
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-blue-500 mt-1">Jawab</p>
          </div>

          {/* 2. BENAR */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-emerald-50 p-3 md:p-6 border border-emerald-100">
            <div className="mb-2 md:mb-3 flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
              <Check className="w-4 h-4 md:w-6 md:h-6" strokeWidth={3} />
            </div>
            <p className="text-xl md:text-3xl font-black text-emerald-700">{correctAnswers}</p>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-600 mt-1">Benar</p>
          </div>

          {/* 3. SALAH */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-red-50 p-3 md:p-6 border border-red-100">
            <div className="mb-2 md:mb-3 flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-full bg-white text-red-500 shadow-sm">
              <X className="w-4 h-4 md:w-6 md:h-6" strokeWidth={3} />
            </div>
            <p className="text-xl md:text-3xl font-black text-red-600">{wrongAnswers}</p>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-red-500 mt-1">Salah</p>
          </div>

        </div>
        {/* --- END STATISTIK GRID --- */}

        {/* Action Buttons */}
        <div className="space-y-3 md:space-y-4">
          <button
            onClick={handlePlayAgain}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 md:py-4 font-bold text-white transition hover:bg-emerald-700 active:scale-[0.98] shadow-lg shadow-emerald-200"
          >
            <RefreshCw className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-sm md:text-base">Coba Lagi</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-100 bg-white py-3.5 md:py-4 font-bold text-gray-500 transition hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300"
          >
            <LogOut className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-sm md:text-base">Selesai & Keluar</span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
           <p className="text-xs md:text-sm text-gray-400">
              User: <span className="font-semibold text-gray-600">{user?.name}</span>
           </p>
        </div>

      </div>
    </div>
  );
}