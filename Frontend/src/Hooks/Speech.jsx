import { useEffect, useRef } from "react";
import { askToAssistant } from "../api/assistant.api";
import { useSelector } from "react-redux";

const Speech = ({setAi}) => {
  const { userData } = useSelector((state) => state.user);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const isAssistantActiveRef = useRef(false);
  const isSpeakingRef = useRef(false);

  // External command ke liye blank tab API call se pehle open hota hai,
  // taake browser popup ko block na kare.
  const commandTabRef = useRef(null);

  const prepareCommandTab = (text) => {
    const command = text.toLowerCase();
    const wantsNavigation = /\b(open|launch|kholo|khol|kholna|chalao|search|play|weather)\b/.test(command);
    const hasExternalTarget = /\b(google|youtube|facebook|whatsapp|instagram|linkedin|calculator|weather)\b/.test(command);

    if (wantsNavigation && hasExternalTarget) {
      if (commandTabRef.current && !commandTabRef.current.closed) {
        commandTabRef.current.close();
      }
      commandTabRef.current = window.open("about:blank", "_blank");
      if (!commandTabRef.current) {
        console.warn("Popup blocked. Browser settings mein Jarvis ke pop-ups allow karein.");
      }
    }
  };

  const openCommandTab = (url) => {
    const tab = commandTabRef.current;
    commandTabRef.current = null;

    if (tab && !tab.closed) {
      tab.location.href = url;
      tab.focus();
      return;
    }

    // Fallback: browser popup settings ki wajah se new tab block ho sakta hai.
    const newTab = window.open(url, "_blank");
    if (!newTab) {
      console.warn("Popup blocked. Browser settings mein Jarvis ke pop-ups allow karein.");
    }
  };

  // Simple arithmetic ko Gemini/calculator website par bhejne ke bajaye locally solve karo.
  const handleLocalCalculation = (text) => {
    const command = text.toLowerCase();
    const normalized = command
      .replace(/multiplied\s+by|multiply\s+by|times/g, " * ")
      .replace(/divided\s+by|divide\s+by/g, " / ")
      .replace(/plus|added\s+to/g, " + ")
      .replace(/minus|subtract/g, " - ")
      .replace(/[×]/g, " * ")
      .replace(/[÷]/g, " / ");

    const looksLikeCalculation = /\b(calculate|compute|solve|sum|addition|add|subtract|minus|multiply|times|divide|divided|plus|what is)\b/.test(command);
    if (!looksLikeCalculation) return false;

    let match = normalized.match(/(-?\d+(?:\.\d+)?)\s*([+*/-])\s*(-?\d+(?:\.\d+)?)/);

    // Example: "sum of 2 and 5" / "add 2 and 5"
    if (!match && /\b(sum|add|addition)\b/.test(command)) {
      const numbers = command.match(/-?\d+(?:\.\d+)?/g);
      if (numbers && numbers.length >= 2) {
        match = [null, numbers[0], "+", numbers[1]];
      }
    }

    if (!match) return false;

    const first = Number(match[1]);
    const operator = match[2];
    const second = Number(match[3]);
    let answer;

    switch (operator) {
      case "+": answer = first + second; break;
      case "-": answer = first - second; break;
      case "*": answer = first * second; break;
      case "/":
        if (second === 0) {
          speak("Zero se divide nahi kar sakte.");
          return true;
        }
        answer = first / second;
        break;
      default: return false;
    }

    console.log("Local calculation:", { first, operator, second, answer });
    speak(`The answer is ${answer}`);
    return true;
  };

  // ==========================================
  // TEXT TO SPEECH
  // ==========================================
const handleCommand = (data) => {
 const { type, query, response, videoId } = data;

  switch (type) {
    // =========================
    // GOOGLE
    // =========================
    case "google_search": {
      const cmd = encodeURIComponent(query);
      openCommandTab(`https://www.google.com/search?q=${cmd}`);
      break;
    }

    // =========================
    // YOUTUBE SEARCH
    // =========================
    case "youtube_search": {
      openCommandTab(`https://www.youtube.com/results?search_query=${encodeURIComponent(query || "")}`);
      break;
    }
    
case "youtube_play": {
  if (!videoId) {
    console.error("YouTube videoId missing:", data);
    break;
  }

  const youtubeUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&autoplay=1`;
  openCommandTab(youtubeUrl);
  break;
}


    // =========================
    // INSTAGRAM
    case "instagram_open": { openCommandTab("https://www.instagram.com/"); break; }
    case "linkedin_open": { openCommandTab("https://www.linkedin.com/"); break; }
    // =========================
    // FACEBOOK
    case "facebook_open": { openCommandTab("https://www.facebook.com/"); break; }

    // =========================
    // WHATSAPP
    case "whatsapp_open": { openCommandTab("https://web.whatsapp.com/"); break; }
    case "whatsapp_search": {
  console.log("WhatsApp search completed:", query);
  break;
}

  
    // =========================
    // WHATSAPP MESSAGE
    // =========================
    case "whatsapp_message": {
      if (data.success) {
        console.log(
          "WhatsApp send action completed:",
          query
        );
      } else {
        console.error(
          "WhatsApp message was not confirmed:",
          data
        );
      }

      break;
    }

    // =========================
    // CALCULATOR
    case "calculator_open": { openCommandTab("https://www.google.com/search?q=calculator"); break; }
    // =========================
    // WEATHER
    // =========================
    case "weather_show": { const searchQuery = query?.trim() || "Faisalabad"; openCommandTab(`https://www.google.com/search?q=${encodeURIComponent(searchQuery + " weather")}`); break; }
    // =========================
    // DATE
    // =========================
    case "get_date": {
      console.log("Date:", response);
      break;
    }

    // =========================
    // TIME
    // =========================
    case "get_time": {
      console.log("Time:", response);
      break;
    }

    // =========================
    // MONTH
    // =========================
    case "get_month": {
      console.log("Month:", response);
      break;
    }

    // =========================
    // GENERAL
    // =========================
    case "general": {
      console.log("General:", response);
      break;
    }

    // =========================
    // USER INPUT
    // =========================
    case "user_input": {
      console.log("User Input:", response);
      break;
    }

    // =========================
    // REGIONAL USER INPUT
    // =========================
    case "regional_user_input": {
      console.log("Regional Input:", response);
      break;
    }

    // =========================
    // DEFAULT
    // =========================
    default: {
      console.log("Unknown command type:", type);
      break;
    }
  }
};


const speak = (text) => {
  if (!text || !window.speechSynthesis) return;

  const synth = window.speechSynthesis;

  // Purani speech cancel karo
  synth.cancel();

  if (recognitionRef.current) {
    try {
      recognitionRef.current.stop();
    } catch {}
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // Urdu script detect karo
  const isUrduScript = /[\u0600-\u06FF]/.test(text);
  const isHindiScript = /[\u0900-\u097F]/.test(text);

  const voices = synth.getVoices();

  let selectedVoice;

  if (isUrduScript) {
    selectedVoice = voices.find(
      (voice) => voice.lang.toLowerCase() === "ur-pk"
    ) || voices.find(
      (voice) => voice.lang.toLowerCase().startsWith("ur")
    );
    utterance.lang = "ur-PK";
  } else if (isHindiScript) {
    selectedVoice = voices.find(
      (voice) => voice.lang.toLowerCase().startsWith("hi")
    );
    utterance.lang = "hi-IN";
  } else {
    // Roman Urdu ke liye Urdu voice preferred hai,
    // agar available ho.
    selectedVoice = voices.find(
      (voice) => voice.lang.toLowerCase() === "ur-pk"
    ) || voices.find(
      (voice) => voice.lang.toLowerCase().startsWith("ur")
    );

    utterance.lang = selectedVoice?.lang || "en-US";
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

utterance.onstart = () => {
  console.log("🔊 Jarvis is speaking");

  isSpeakingRef.current = true;
setAi?.("speaking");
};

utterance.onend = () => {
  console.log("🔊 Jarvis stopped speaking");

  isSpeakingRef.current = false;
  isAssistantActiveRef.current = false;

  setAi?.("idle");

  if (isListeningRef.current && recognitionRef.current) {
    setTimeout(() => {
      try {
        recognitionRef.current.start();
      } catch (error) {
        // Recognition already running
      }
    }, 300);
  }
};

utterance.onerror = (event) => {
  console.error("Speech error:", event.error);

  isSpeakingRef.current = false;
  setAi?.("idle");
};

  synth.speak(utterance);
};



  // ==========================================
  // SPEECH RECOGNITION
  // ==========================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log(
        "❌ Speech Recognition is not supported."
      );
      return;
    }

    if (!window.speechSynthesis) {
      console.log(
        "❌ Speech Synthesis is not supported."
      );
      return;
    }

    const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = "en-IN";
recognition.maxAlternatives = 3;

    // ==========================================
    // Recognition Start
    // ==========================================

    recognition.onstart = () => {
      console.log("🎤 Mic is ON");

      isListeningRef.current = true;
    };

    // ==========================================
    // Recognition Result
    // ==========================================

    recognition.onresult = async (e) => {
      // Assistant ki voice ko ignore karo
      if (isSpeakingRef.current) {
        return;
      }

      const transcript =
        e.results[e.results.length - 1][0].transcript.trim();

      console.log("🎤 Heard:", transcript);

      if (!userData?.assistantName) {
        return;
      }

      const assistantName =
        userData.assistantName.trim();

      const lowerTranscript =
        transcript.toLowerCase();

      const lowerAssistantName =
        assistantName.toLowerCase();

      // ==========================================
      // 1. Assistant already active
      // ==========================================

      if (isAssistantActiveRef.current) {
        console.log("🚀 Assistant active");

        if (handleLocalCalculation(transcript)) return;
        prepareCommandTab(transcript);

        try {
          const result =
            await askToAssistant(transcript);

          console.log(
            "🤖 Assistant response:",
            result
          );

          // Backend response speak karo
          speak(result.response);
          handleCommand(result)
        } catch (error) {
          console.log(
            "Assistant API Error:",
            error.response?.data ||
              error.message
          );

          isAssistantActiveRef.current = false;
        }

        return;
      }

      // ==========================================
      // 2. Wake word detect
      // ==========================================

      if (
        !lowerTranscript.includes(
          lowerAssistantName
        )
      ) {
        // Assistant name nahi bola
        return;
      }

      console.log(
        "🟢 Assistant name detected"
      );

      // Assistant name remove karo
      const command = transcript
        .replace(
          new RegExp(assistantName, "i"),
          ""
        )
        .trim();

      // ==========================================
      // 3. Only "Jarvis"
      // ==========================================

      if (!command) {
        console.log(
          "👂 Assistant activated. Waiting for command..."
        );

        isAssistantActiveRef.current = true;

        // Wake response
        speak("Yes?");

        return;
      }

      // ==========================================
      // 4. Same sentence
      // "Jarvis open YouTube"
      // ==========================================

      console.log(
        "🚀 Sending prompt:",
        command
      );

      if (handleLocalCalculation(command)) return;
      prepareCommandTab(command);

      try {
        const result =
          await askToAssistant(command);

        console.log(
          "🤖 Assistant response:",
          result
        );

        // IMPORTANT
        // Same sentence ka response bhi speak hoga
        speak(result.response);
        handleCommand(result)
      } catch (error) {
        console.log(
          "Assistant API Error:",
          error.response?.data ||
            error.message
        );
      }
    };

    // ==========================================
    // Recognition Error
    // ==========================================

    recognition.onerror = (event) => {
      console.log(
        "❌ Speech Recognition Error:",
        event.error
      );

      if (event.error === "not-allowed") {
        console.log(
          "❌ Microphone permission denied."
        );
      }
    };

    // ==========================================
    // Recognition End
    // ==========================================

    recognition.onend = () => {
      console.log(
        "🎤 Recognition ended"
      );

      // Agar assistant speak nahi kar raha
      if (
        isListeningRef.current &&
        !isSpeakingRef.current
      ) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (error) {
            // Already running hai
          }
        }, 500);
      }
    };

    recognitionRef.current = recognition;

    // ==========================================
    // Start microphone
    // ==========================================

    try {
      recognition.start();
    } catch (error) {
      console.log(
        "❌ Mic start error:",
        error.message
      );
    }

    // ==========================================
    // Cleanup
    // ==========================================

    return () => {
      isListeningRef.current = false;
      isAssistantActiveRef.current = false;
      isSpeakingRef.current = false;

      recognition.onend = null;

      // Speech stop
      window.speechSynthesis.cancel();

      try {
        recognition.stop();
      } catch (error) {
        console.log(
          "Recognition stop error:",
          error.message
        );
      }

      recognitionRef.current = null;
    };
  }, [userData?.assistantName]);

  return null;
};

export default Speech;
