
import axios from "axios";

export const askToAssistant = async (prompt) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/user/askToAssistant`,
      { prompt },
      { withCredentials: true }
    );

    return data;
  } catch (error) {
    console.error(
      "Assistant API Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};