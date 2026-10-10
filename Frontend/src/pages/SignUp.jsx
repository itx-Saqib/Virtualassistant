import bg from '../assets/authBg.png'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { GoEyeClosed } from "react-icons/go";
import { IoEye } from "react-icons/io5";
 import { useFormik } from 'formik';
 import axios from 'axios'
import { registerSchema } from '../schema/auth.schema';
import { useDispatch} from 'react-redux'
import { setUserData } from '../redux/features/userSlice';
const SignUp = () => {
    const [isShow, setIsShow] = useState(false)
    const [Error, setError] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {errors,touched,handleSubmit,handleBlur,handleChange,values} = useFormik({
     initialValues:{
      name:"",
      email:"",
      password:""
     },
     validationSchema:registerSchema,
     onSubmit:async(values,{resetForm})=>{
      try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/register`,values,{withCredentials:true})
        console.log(res.data)
        dispatch(setUserData(res.data.user))
        resetForm() 
        navigate('/customize')
      } catch (error) {
        console.log(error)
        setError(error.response?.data?.message)

      }
     }
    })
  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{backgroundImage:`url(${bg})`}}>

<form
  onSubmit={handleSubmit}
  className="w-[90%] min-h-[500px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-4 px-5 py-8 rounded-2xl"
>
  <h1 className="text-white font-semibold text-3xl mb-3 text-center">
    Register to{" "}
    <span className="text-blue-500">
      Virtual Assistant
    </span>
  </h1>

  {/* Name */}
  <div className="w-full">
    <input
      type="text"
      name="name"
      value={values.name}
      onChange={handleChange}
      onBlur={handleBlur}
      autoComplete="name"
      placeholder="Enter Your Name"
      className="w-full h-[50px] bg-transparent text-white border-2 border-white text-xl rounded-full placeholder-gray-300 outline-none px-5 py-2"
    />

    {errors.name && touched.name && (
      <p className="text-sm text-red-500 mt-1 ml-5">
        {errors.name}
      </p>
    )}
  </div>

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
      className="w-full h-[50px] bg-transparent text-white border-2 border-white text-xl rounded-full placeholder-gray-300 outline-none px-5 py-2"
    />

    {errors.email && touched.email && (
      <p className="text-sm text-red-500 mt-1 ml-5">
        {errors.email}
      </p>
    )}
  </div>

  {/* Password */}
  <div className="w-full">
    <div className="w-full h-[50px] relative bg-transparent text-white border-2 border-white text-xl rounded-full">
      <input
        type={isShow ? "text" : "password"}
        name="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        autoComplete="new-password"
        placeholder="Enter your Password"
        className="w-full h-full bg-transparent rounded-full placeholder-gray-300 outline-none px-5 py-2 pr-14"
      />

      <div
        onClick={() => setIsShow(!isShow)}
        className="absolute top-1/2 -translate-y-1/2 right-5 text-white cursor-pointer text-xl"
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
  {Error && (
    <p className="text-sm text-red-500 text-center">
      {Error}
    </p>
  )}

  {/* Button */}
  <button
    type="submit"
    className="bg-white rounded-full text-black min-w-[150px] text-xl cursor-pointer mt-2 h-[50px] font-semibold px-6"
  >
    Sign Up
  </button>

  {/* Login */}
  <p className="text-white">
    Already have an Account?{" "}
    <span
      className="cursor-pointer text-blue-400 ml-1"
      onClick={() => navigate("/login")}
    >
      Sign In
    </span>
  </p>
</form>


        </div>

  )
}

export default SignUp