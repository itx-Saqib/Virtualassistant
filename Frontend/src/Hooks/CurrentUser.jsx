import  { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/features/userSlice'
const CurrentUser = () => {
    const dispatch = useDispatch()
 useEffect(()=>{
    const getUser = async()=>{
        try {
         const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/current`,{withCredentials:true})
         dispatch(setUserData(res.data.user))
        } catch (error) {
            console.log(error)
        }
    }
     getUser();
 },[dispatch])
  return null
}

export default CurrentUser