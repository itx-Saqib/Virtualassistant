import React, { useState } from "react";
import bg from "../assets/authBg.png";
import { useNavigate } from "react-router-dom";
import { GoEyeClosed } from "react-icons/go";
import { IoEye } from "react-icons/io5";
import { useFormik } from "formik";
import axios from "axios";
import { loginSchema } from "../schema/auth.schema";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/features/userSlice";

const LogIn = () => {
  const [isShow, setIsShow] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    errors,
    touched,
    handleSubmit,
    handleBlur,
    handleChange,
    values,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: loginSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/login`,
          values,
          {
            withCredentials: true,
          }
        );

        console.log(res.data);
        dispatch(setUserData(res.data.user))
        resetForm();

      
        navigate("/");
      } catch (error) {
        console.log(error);

        setError(
          error.response?.data?.message ||
            "Something went wrong"
        );
      }
    },
  });

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex justify-center items-center px-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[500px] min-h-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-4 px-5 py-8 rounded-2xl"
      >
        {/* Heading */}
        <h1 className="text-white font-semibold text-3xl mb-4 text-center">
          LogIn to{" "}
          <span className="text-blue-500">
            Virtual Assistant
          </span>
        </h1>

        {/* Email */}
        <div className="w-full">
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="email"
            placeholder="Enter Your Email"
            className="w-full h-[55px] bg-transparent text-white border-2 border-white text-xl rounded-full placeholder-gray-300 outline-none px-5 py-2"
          />

          {errors.email && touched.email && (
            <p className="text-sm text-red-500 mt-1 ml-5">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="w-full">
          <div className="w-full h-[55px] relative bg-transparent text-white border-2 border-white rounded-full">
            <input
              type={isShow ? "text" : "password"}
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="current-password"
              placeholder="Enter your Password"
              className="w-full h-full bg-transparent text-xl rounded-full placeholder-gray-300 outline-none px-5 py-2 pr-14"
            />

            <div
              onClick={() => setIsShow(!isShow)}
              className="absolute top-1/2 -translate-y-1/2 right-5 text-white text-xl cursor-pointer"
            >
              {isShow ? <IoEye /> : <GoEyeClosed />}
            </div>
          </div>

          {errors.password && touched.password && (
            <p className="text-sm text-red-500 mt-1 ml-5">
              {errors.password}
            </p>
          )}
        </div>

        {/* Backend Error */}
        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="bg-white rounded-full text-black min-w-[150px] text-xl cursor-pointer mt-3 h-[50px] font-semibold px-6"
        >
          Sign In
        </button>

        {/* Signup */}
        <p className="text-white">
          Don't have an Account?{" "}
          <span
            className="cursor-pointer text-blue-400 ml-1"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default LogIn;

