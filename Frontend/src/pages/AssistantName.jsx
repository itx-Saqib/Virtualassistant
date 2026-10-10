import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserData } from "../redux/features/userSlice";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
const AssistantName = () => {
  const { userData, backendImage, selectedImage } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );

  const handleUpdateAssistant = async () => {
    try {
      const formData = new FormData();

      formData.append("assistantName", assistantName);

      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }

      console.log("Selected Image:", selectedImage);
      console.log("Backend Image:", backendImage);
      console.log("Assistant Name:", assistantName);

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/user/update`,
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Backend Response:", res.data);

      dispatch(setUserData(res.data.user));

      setAssistantName("");

      navigate("/");
    } catch (error) {
      console.log(
        "Update Error:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t relative from-black to-[#020225ec] flex justify-center items-center flex-col p-5 gap-5">
      <IoArrowBackOutline onClick={()=>navigate('/customize')} className="text-white  cursor-pointer h-7 w-7 absolute left-9 top-9" />
      <h1 className="text-white text-2xl mb-5 font-semibold">
       Enter Your 
        <span className="text-blue-200"> Assistant Name</span>
      </h1>

      <input
        type="text"
        name="name"
        value={assistantName}
        autoComplete="name"
        onChange={(e) => setAssistantName(e.target.value)}
        placeholder="Enter Your Assistant Name"
        className="w-full max-w-[400px] h-[50px] bg-transparent text-white border-2 border-white text-xl rounded-full placeholder-gray-300 outline-none px-5 py-2"
      />

      {assistantName && (
        <button
          type="button"
          onClick={handleUpdateAssistant}
          className="bg-white rounded-full text-black min-w-[250px] text-xl cursor-pointer mt-2 h-[50px] font-semibold px-6"
        >
          Create Your Assistant
        </button>
      )}
    </div>
  );
};

export default AssistantName;