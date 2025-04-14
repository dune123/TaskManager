import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const RegisterComponents = ({setLoginStatus}) => {
  const [formData,setFormData]=useState({
    username:"",
    email:"",
    password:"",
    confirmpassword:""
  })

  async function registerUser(){
    try {
      const res=await axios.post('https://promanagerbakend.onrender.com/api/user/register',
        formData
      )
      
      if (res.status === 201) {
        toast.success(res.data.message);
        setLoginStatus(true);
      } else {
        toast.error(res.data.message);
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='flex flex-col items-center gap-10 pt-20 w-[50%]'>
        <h1 className='text-3xl'>Register</h1>
        <div className='flex flex-col gap-4'>
        <input type='text' placeholder='Name' className='p-2 border-[#D0D0D0] border-2 w-[30vw] rounded-md'
          onChange={(e)=>setFormData((prev)=>({
              ...prev,
              username:e.target.value
            }))}
        />
        <input type='text' placeholder='Email' className='p-2 border-[#D0D0D0] border-2 w-[30vw] rounded-md' 
        onChange={(e)=>setFormData((prev)=>({
              ...prev,
              email:e.target.value
            }))}/>
        <input type='text' placeholder='Password' className='p-2 border-[#D0D0D0] border-2 w-[30vw] rounded-md'
          onChange={(e)=>setFormData((prev)=>({
              ...prev,
              password:e.target.value
            }))}
        />
        <input type='text' placeholder='Confirm Password' className='p-2 border-[#D0D0D0] border-2 w-[30vw] rounded-md' onChange={(e)=>setFormData((prev)=>({
              ...prev,
              confirmpassword:e.target.value
            }))}/>
        </div>
        <button className='bg-[#17A2B8] w-[30vw] p-2 rounded-2xl text-white' onClick={registerUser}>Register</button>
        <h2>Have an account</h2>
        <button className='bg-[white] border-[#17A2B8] border-2 w-[30vw] p-2 rounded-2xl text-[#17A2BB]' onClick={()=>setLoginStatus(true)}>Login</button>
    </div>
  )
}

export default RegisterComponents