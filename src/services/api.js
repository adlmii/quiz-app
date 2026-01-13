import axios from "axios";

const API_URL = "https://opentdb.com/api.php";

export const getQuestions = async () => {
  try {
    // Request ke OpenTDB
    const response = await axios.get(API_URL, {
      params: {
        amount: 10,
        type: "multiple",
      },
    });

    // Cek Response Code dari OpenTDB (0 = Success)
    if (response.data.response_code !== 0) {
      throw new Error("Gagal mengambil soal dari server (API Limit/Error).");
    }

    return response.data.results;
  } catch (error) {
    // Lempar error biar bisa ditangkap di Component/Context
    console.error("API Service Error:", error);
    throw error;
  }
};