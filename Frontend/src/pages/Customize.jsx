import { useRef } from "react";
import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";

import { RiImageUploadLine } from "react-icons/ri";

import { useDispatch, useSelector } from "react-redux";
import {
  setBackendImage,
  setFrontendImage,
  setSelectedImage,
} from "../redux/features/userSlice";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

const Customize = () => {
  const inputImage = useRef(null);
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { frontendImage,selectedImage } = useSelector((state) => state.user);
  console.log("Current selectedImage:", selectedImage);

const handleImage = (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const imageUrl = URL.createObjectURL(file);

  dispatch(setBackendImage(file));
  dispatch(setFrontendImage(imageUrl));
  dispatch(setSelectedImage("input"));
};

  return (
    <div className="w-full relative min-h-screen bg-gradient-to-t from-black to-[#020225ec] flex justify-center items-center flex-col p-5">
       <IoArrowBackOutline onClick={()=>navigate('/')} className="text-white  cursor-pointer h-7 w-7 absolute left-9 top-9" />
      <h1 className="text-white text-2xl mb-5 font-semibold">
        Select Your
        <span className="text-blue-200"> Assistant Image</span>
      </h1>

      <div className="w-[90%] max-w-[52%] flex justify-center items-center flex-wrap gap-[15px] mb-2">

<Card image={image1} />
<Card image={image2} />
<Card image={image3} />
<Card image={image4} />
<Card image={image5} />
<Card image={image6} />
<Card image={image7} />

        <div
          onClick={() => {
            inputImage.current?.click()
            

          }}
          className={`w-[75px] h-[120px] lg:w-[120px] lg:h-[180px] cursor-pointer bg-[#030333] border-2 overflow-hidden rounded-2xl border-[#2f2f9848] hover:shadow-2xl hover:shadow-blue-950 hover:border-4 hover:border-white flex items-center justify-center ${selectedImage === "input" ? "shadow-2xl shadow-blue-950 border-4 border-white":null}`}
        >
          {frontendImage ? (
            <img
              src={frontendImage}
              alt="Selected assistant"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <RiImageUploadLine className="w-6 h-6 lg:w-10 lg:h-10 text-white" />
          )}

          <input
            type="file"
            ref={inputImage}
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />
        </div>
      </div>

{selectedImage &&       <button
        type="button"
        onClick={()=>navigate('/assistant-name')}
        className="bg-white rounded-full text-black min-w-[150px] text-xl cursor-pointer mt-2 h-[50px] font-semibold px-6"
      >
        Next
      </button>}
    </div>
  );
};

export default Customize;