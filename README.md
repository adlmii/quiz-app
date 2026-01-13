# DOT Quiz App 🧠

Aplikasi kuis interaktif berbasis **React 19** dan **Vite**, dikembangkan sebagai solusi *Technical Challenge*. Aplikasi ini mengintegrasikan API OpenTDB, manajemen state global, dan mekanisme persistensi data yang optimal.

## ✨ Fitur Utama

Sesuai dengan kriteria *requirements*:

- ✅ **User Login:** Sistem input nama sederhana dengan proteksi rute (Route Protection).
- ✅ **Dynamic Data:** Mengambil soal secara *real-time* dari [OpenTDB API](https://opentdb.com/).
- ✅ **Global Timer:** Timer hitung mundur (default: 60 detik). Kuis otomatis selesai jika waktu habis.
- ✅ **Smart Navigation:** Satu soal per halaman. Pindah otomatis setelah memilih jawaban.
- ✅ **Result Analysis:** Menampilkan skor, jumlah benar, salah, dan total dijawab.
- ✅ **Responsive UI:** Tampilan modern dan responsif (Mobile First) menggunakan Tailwind CSS v4.

### 🌟 Technical Highlights

- **Optimized Resume Mechanism:**
  Menggunakan `localStorage` untuk menyimpan progres. User bisa menutup browser atau me-refresh halaman tanpa kehilangan progres (posisi soal, jawaban, dan sisa waktu).
- **Performance Optimization:**
  - **Anti-Thrashing:** State timer (`timeLeft`) *tidak* disimpan ke LocalStorage setiap detik untuk menghindari operasi *write* yang berlebihan.
  - **Drift-Correction:** Menggunakan logika `Date.now()` dan `endTime` timestamp untuk menghitung sisa waktu, sehingga timer tetap akurat meskipun tab tidak aktif.

## 🛠️ Tech Stack

- **Core:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing:** [React Router DOM v7](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Package Manager:** pnpm

## 🚀 Cara Menjalankan

Pastikan Node.js sudah terinstal di komputer Anda.

1. **Clone Repository**
   ```bash
   git clone [https://github.com/username-anda/dot-quiz-app.git](https://github.com/username-anda/dot-quiz-app.git)
   cd dot-quiz-app
   ```
2. **Install Dependencies Proyek ini menggunakan (`pnpm`).**
   ```bash
   pnpm install

   # atau jika menggunakan npm:
   npm install
   ```
3. **Jalankan Development Server**
   ```bash
   pnpm run dev
   ```
   Buka (`http://localhost:5173`) di browser.

## 📂 Struktur Proyek
```
src/
├── components/     # Komponen UI (QuestionCard, dll)
├── context/        # Global State (QuizContext) & Logic Timer
├── hooks/          # Custom Hooks (useDocumentTitle)
├── pages/          # Halaman Utama (Login, Quiz, Result)
├── services/       # Konfigurasi API (Axios)
└── utils/          # Konstanta & Helper functions
```
