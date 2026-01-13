import { useEffect } from "react";

/**
 * Custom Hook untuk mengubah judul tab browser secara dinamis.
 * @param {string} title - Judul yang ingin ditampilkan
 */
export default function useDocumentTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    // Cleanup: Kembalikan judul semula saat komponen di-unmount (opsional)
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}