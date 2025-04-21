import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiLoader } from "react-icons/fi";


const LoggingState=()=>(
  <div className='fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000] flex justify-center items-center'>
			<div className='w-[42.5vw] h-[30vh] bg-white flex flex-col gap-[2vh] pt-[3vh] px-[2vw] rounded-md'>
				<div className='flex flex-col items-center gap-4 pt-6'>
					<FiLoader className='size-6 text-[#17A2B8] animate-spin' />
					<h3 className='text-[#17A2B8] text-xl font-bold'>Logging you in</h3>
					<p className='text-[#17A2B8] text-sm'>Redirecting...</p>
				</div>
			</div>
		</div>
)

const LoginComponents = ({setLoginStatus}) => {
  const [loading,setLoading]=useState(false);
  const [formData,setFormData]=useState({
    email:"",
    password:""
  })
  const Navigate=useNavigate();
  async function LoginUser(){
    setLoading(true);
    try {
      const response=await axios.post('https://promanagerbakend.onrender.com/api/user/login',
        formData
      )

      if(response.status==201){
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("Username",response.data.username)
        localStorage.setItem("email",response.data.email)
        toast.success("Login successfully")
        Navigate("/dashboard")
      }
      else{
        toast.error(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      toast.error(error.message)
      setLoading(false);
    }
    finally{
      setLoading(false);
    }
  }

  if(loading){
    return <LoggingState/>
  }

  return (
    <div className='flex flex-col items-center gap-10 pt-20 w-[50%]'>
        <h1 className='text-3xl'>Login</h1>
        <div className='flex flex-col gap-4'>
          <input type='text' placeholder='Email' className='p-2 border-[#D0D0D0] border-2 w-[30vw] rounded-md'
            onChange={(e)=>setFormData((prev)=>({
              ...prev,
              email:e.target.value
            }))}
          />
          <input type='password' placeholder='Password' className='p-2 border-[#D0D0D0] border-2 w-[30vw] rounded-md'
            onChange={(e)=>setFormData((prev)=>({
              ...prev,
              password:e.target.value
            }))}
          />
        </div>
          <button className='bg-[#17A2B8] w-[30vw] p-2 rounded-2xl text-white' onClick={LoginUser}>Log in</button>
        <h2>Have no account yet?</h2>
        <button className='bg-[white] border-[#17A2B8] border-2 w-[30vw] p-2 rounded-2xl text-[#17A2BB]' onClick={()=>setLoginStatus(false)}>Register</button>
    </div>
  )
}

export default LoginComponents