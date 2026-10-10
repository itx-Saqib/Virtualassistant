import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setUserData } from '../redux/features/userSlice'
import Speech from '../Hooks/Speech'
import aiImg from '../assets/ai.gif'
import userImg from '../assets/user.gif'
import { useState } from 'react'

const Index = () => {
  const {userData} = useSelector(state=>state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [ai, setAi] = useState("idle")
 const handleLogOut = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/logout`,
      {
        withCredentials: true,
      }
    );

    console.log("Logout response:", res.data);

    dispatch(setUserData(null));
    navigate("/login");
  } catch (error) {
    console.log(
      "Logout Error:",
      error.response?.data?.message || error.message
    );
  }
};
  return (
    <div className="w-full min-h-screen gap-3.5 bg-gradient-to-t relative from-black to-[#020225ec] flex justify-center items-center flex-col">
      <Speech setAi={setAi}/>
        <button
    type="submit"
    onClick={handleLogOut}
    className="bg-white rounded-full absolute top-6 right-5 text-black min-w-[150px] text-xl cursor-pointer mt-2 h-[50px] font-semibold px-6"
  >
    LogOut
  </button>
    <button
    type="submit"
    onClick={()=>{navigate('/customize')}}
    className="bg-white rounded-full absolute top-28 right-5 text-black min-w-[150px] text-xl cursor-pointer mt-2 h-[50px] font-semibold px-6"
  >
    Customize Your Assistant
  </button>
      <div className='h-[320px] w-[220px] flex items-center overflow-hidden justify-center shadow-lg rounded-4xl'>
        <img src={userData?.assistantImage} alt="assistantImage" className='h-full object-contain object-cover' />
        
      </div>
      <h1 className='text-white text-xl font-semibold'>I'm  {userData?.assistantName}</h1>


{ai === "speaking" ? (
  <img
    src={aiImg}
    alt="Assistant speaking"
    className="w-[180px]"
  />
) : (
  <img
    src={userImg}
    alt="Assistant idle"
    className="w-[180px]"
  />
)}


    </div> 
  )
}

export default Index