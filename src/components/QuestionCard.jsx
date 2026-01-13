import { CheckCircle } from "lucide-react";

export default function QuestionCard({ data, onAnswer, totalQuestions, currentIndex }) {
  const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div className="w-full max-w-2xl animate-fade-in">
      <div className="mb-6 flex items-center justify-between text-sm font-medium text-gray-500">
        <span>Question {currentIndex + 1} of {totalQuestions}</span>
        <span className="flex items-center gap-1 text-emerald-600">
          <CheckCircle size={16} /> Single Choice
        </span>
      </div>

      <h2 className="mb-8 text-xl font-bold leading-relaxed text-gray-800 md:text-2xl">
        {decodeHTML(data.question)}
      </h2>

      <div className="grid gap-4">
        {data.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(option)}
            className="group flex w-full items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-4 text-left font-medium text-gray-700 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:shadow-md active:scale-[0.98]"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500 transition-colors group-hover:bg-emerald-200 group-hover:text-emerald-700">
                {String.fromCharCode(65 + idx)}
              </span>
              {decodeHTML(option)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}