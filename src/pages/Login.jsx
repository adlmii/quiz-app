import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { User, Sparkles, ArrowRight, BrainCircuit, Zap } from "lucide-react";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Login() {
  const [name, setName] = useState("");
  const { login, user } = useQuiz();
  const navigate = useNavigate();
  
  useDocumentTitle("Login | DOT Quiz Challenge");

  useEffect(() => {
    if (user) navigate("/quiz");
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    login(name);
    navigate("/quiz");
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      
      {/* --- BAGIAN KIRI (DESKTOP VISUAL) --- */}
      {/* Menggunakan width 50% (lg:w-1/2) atau 60% (xl:w-7/12) untuk tampilan lebih dominan */}
      <div className="relative hidden lg:flex w-1/2 xl:w-7/12 flex-col justify-between bg-emerald-950 px-16 py-20 text-white overflow-hidden">
        
        {/* Dekorasi Background Abstrak */}
        <div className="absolute top-0 right-0 h-150 w-150 translate-x-1/3 -translate-y-1/4 rounded-full bg-emerald-500/20 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 h-125 w-125 -translate-x-1/4 translate-y-1/4 rounded-full bg-teal-600/20 blur-[100px]"></div>
        
        {/* Konten Atas: Logo/Brand Kecil */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/30">
            <BrainCircuit className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">DOT Quiz</span>
        </div>

        {/* Konten Tengah: Headline Besar */}
        <div className="relative z-10 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-800/30 px-4 py-2 text-sm font-medium backdrop-blur-md text-emerald-100">
            <Zap size={16} className="fill-yellow-400 text-yellow-400" />
            <span>Platform Kuis #1 untuk Developer</span>
          </div>
          
          <h1 className="font-sans text-5xl font-extrabold leading-[1.1] tracking-tight xl:text-7xl">
            Asah <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-300 to-teal-300">Logika</span> & <br/>
            Wawasanmu.
          </h1>
          
          <p className="mt-8 max-w-lg text-lg text-gray-300 leading-relaxed">
            Bergabunglah dengan ribuan peserta lainnya. Uji pengetahuanmu dalam berbagai topik menarik dengan antarmuka yang cepat dan modern.
          </p>
        </div>

        {/* Konten Bawah: Footer/Quote */}
        <div className="relative z-10 text-sm text-emerald-200/60 font-medium">
          &copy; 2026 DOT Quiz App. Designed for Performance.
        </div>
      </div>


      {/* --- BAGIAN KANAN (FORM LOGIN) --- */}
      <div className="flex w-full flex-col justify-center items-center bg-gray-50 px-6 py-12 lg:w-1/2 xl:w-5/12 lg:bg-white lg:px-20">
        
        <div className="w-full max-w-105 animate-fade-in">
          {/* Header Mobile Only */}
          <div className="mb-10 flex justify-center lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 shadow-xl shadow-emerald-200">
              <BrainCircuit className="text-white" size={32} />
            </div>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Selamat Datang</h2>
            <p className="mt-3 text-gray-500">
              Silakan masukkan nama Anda untuk memulai sesi kuis baru.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-gray-900 block">
                Nama Lengkap
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  id="name"
                  className="block w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm group-hover:border-gray-300"
                  placeholder="Ketik namamu di sini..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-emerald-600 py-4 px-8 font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <span className="relative z-10">Mulai Tantangan</span>
              <ArrowRight size={20} className="relative z-10 transition-transform group-hover:translate-x-1" />
              
              {/* Efek Kilau saat Hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent z-0"></div>
            </button>
          </form>

          {/* Footer Mobile */}
          <p className="mt-10 text-center text-xs text-gray-400 lg:hidden">
            Secure & Fast Quiz Platform
          </p>
        </div>
      </div>

    </div>
  );
}