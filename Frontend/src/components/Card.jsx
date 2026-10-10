import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setBackendImage,
  setFrontendImage,
  setSelectedImage,
} from "../redux/features/userSlice";

const Card = ({ image }) => {
  const dispatch = useDispatch();
  const { selectedImage } = useSelector((state) => state.user);

  const handleSelect = () => {
    dispatch(setSelectedImage(image));
    dispatch(setBackendImage(null));
    dispatch(setFrontendImage(null));

    console.log("Selected predefined image:", image);
  };

  return (
    <div
      onClick={handleSelect}
      className={`w-[75px] h-[120px] lg:w-[120px] lg:h-[180px]
      bg-[#030333] border-2 overflow-hidden rounded-2xl
      border-[#2f2f9848] hover:shadow-2xl hover:shadow-blue-950
      hover:border-4 hover:border-white transition-all duration-200 cursor-pointer
      ${
        selectedImage === image
          ? "shadow-2xl shadow-blue-950 border-4 border-white"
          : ""
      }`}
    >
      <img
        src={image}
        alt="Assistant"
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
};

export default Card;