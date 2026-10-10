import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name:'user',
    initialState:{
        userData:null,
        frontendImage:null,
        backendImage:null,
        selectedImage:null,
       
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData = action.payload;
        },
        setFrontendImage:(state,action)=>{
            state.frontendImage = action.payload;
        },
        setBackendImage:(state,action)=>{
            state.backendImage = action.payload;
        },
        setSelectedImage:(state,action)=>{
            state.selectedImage = action.payload
        },

    }
})

export const {setUserData,setFrontendImage,setBackendImage,setGeminiResponse,setSelectedImage} = userSlice.actions
export default userSlice.reducer