import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { UserCircle } from "lucide-react";
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border-t-4 border-emerald-500">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-emerald-100 p-4 text-emerald-600">
            <UserCircle size={48} />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">DOT Quiz Challenge</h1>
          <p className="mb-6 text-gray-500">
            Masukkan namamu untuk memulai tantangan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="sr-only">Nama Lengkap</label>
            <input
              type="text"
              id="name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Ketik namamu di sini..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Mulai Kuis
          </button>
        </form>
      </div>
    </div>
  );
}