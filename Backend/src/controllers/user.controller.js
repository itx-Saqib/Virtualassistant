const moment = require("moment");
const axios = require("axios");
const User = require("../models/user.models");
const askGemini = require("../gemini");
const {
  openWhatsAppAndSearch,
  sendWhatsAppMessage,
} = require("../lib/whatsappAutomation");
const uploadOnCloudinary = require('../lib/cloudinary')
const getCurrentUser = async(req,res)=>{
    try {
        const userId = req.userId
         const user = await User.findById(userId).select('-password')
         if(!user){
            return res.status(404).json({message:"user not found."})
         }
         
         return res.status(200).json({message: "Getting user successfully",user})
    } catch (error) {
        res.status(500).json({message:"Internals server error."})
    }
}

const updateAssistant = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const { assistantName,imageUrl } = req.body;

    if (!assistantName) {
      return res.status(400).json({
        message: "Assistant name is required.",
      });
    }

    // Update assistant name
    user.assistantName = assistantName;

    // Update image only if new image is provided
    let assistantImage ;
  if(req.file){
   assistantImage = await uploadOnCloudinary(req.file.path)
    if(!assistantImage){
        return res.status(400).json({message:"cloudinary image upload error."})
    }
  }else{
    assistantImage = imageUrl;
  }
    user.assistantImage = assistantImage;
    await user.save();

    return res.status(200).json({
      message: "User updated successfully.",
      user,
    })
  } catch (error) {
    console.error("Update Assistant Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


const askToAssistant = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        message: "Prompt is required.",
      });
    }

    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    user.history.push(prompt);
    await user.save();

    const raw = await askGemini(
      prompt,
      user.assistantName,
      user.name
    );

    let geminiResponse;

    try {
      const cleaned = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      geminiResponse = JSON.parse(cleaned);
    } catch (error) {
      console.error("Gemini JSON Parse Error:", error, "\nRaw:", raw);

      return res.status(502).json({
        message: "Invalid assistant response.",
      });
    }

    const type = geminiResponse.type;
    const query = geminiResponse.query || "";
    const response = geminiResponse.response || "";

    switch (type) {
      case "get_date":
        return res.json({
          type,
          query,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });

      case "get_time":
        return res.json({
          type,
          query,
          response: `Current time is ${moment().format("hh:mm A")}`,
        });

      case "get_month":
        return res.json({
          type,
          query,
          response: `Current month is ${moment().format("MMMM")}`,
        });

      case "get_day":
        return res.json({
          type,
          query,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "youtube_play": {
        const searchQuery = query.trim();

        if (!searchQuery) {
          return res.status(400).json({
            message: "Song or video name is required.",
          });
        }

        const youtubeResult = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              part: "snippet",
              q: searchQuery,
              type: "video",
              maxResults: 1,
              key: process.env.YOUTUBE_API_KEY,
            },
          }
        );

        const videoId =
          youtubeResult.data.items?.[0]?.id?.videoId;

        if (!videoId) {
          return res.status(404).json({
            message: "No YouTube video found.",
          });
        }

        return res.json({
          type: "youtube_play",
          query: searchQuery,
          videoId,
          response: response || `Opening ${searchQuery} on YouTube.`,
        });
      }

      case "whatsapp_search": {
        const contactName = query.trim();

        if (!contactName) {
          return res.status(400).json({
            message: "Contact name is required.",
          });
        }

        const result = await openWhatsAppAndSearch(contactName);

        return res.json({
          type,
          query: contactName,
          response: result.message,
          success: result.success,
        });
      }


   case "whatsapp_message": {
  console.log("📩 WhatsApp message command received");

  const contactName = geminiResponse.query?.trim();
  const messageText = geminiResponse.message?.trim();

  console.log("Contact:", contactName);
  console.log("Message:", messageText);

  if (!contactName) {
    return res.status(400).json({
      message: "WhatsApp contact name is required.",
    });
  }

  if (!messageText) {
    return res.status(400).json({
      message: "WhatsApp message text is required.",
    });
  }

  const result = await sendWhatsAppMessage(
    contactName,
    messageText
  );

  console.log("✅ WhatsApp automation result:", result);

  return res.status(200).json({
    type,
    query: contactName,
    message: messageText,
    response: result.message || response,
    success: result.success,
  });
}
      case "google_search":
      case "youtube_search":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
      case "regional_user_input":
      case "user_input":
      case "general":
      case "linkedin_open":
      case "whatsapp_open":
        return res.json({
          type,
          query,
          response,
        });

      default:
        return res.status(400).json({
          message: "I didn't understand that command.",
          type,
        });
    }
  } catch (error) {
    console.error("Assistant Error:", error);

    if (error.response?.status === 429) {
      return res.status(429).json({
        message: "Gemini API quota exceeded.",
      });
    }

    if (error.response?.status === 503) {
      return res.status(503).json({
        message: "Gemini is temporarily unavailable.",
      });
    }

    return res.status(500).json({
      message: "Assistant error.",
      error: error.message,
    });
  }
};








module.exports = {getCurrentUser,updateAssistant,askToAssistant} ;