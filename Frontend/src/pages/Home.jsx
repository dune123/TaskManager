import React, { useState } from 'react'
import RegisterComponents from '../components/RegisterComponents'
import LoginComponents from '../components/LoginComponents'

const Home = () => {
    const [loginStatus,setLoginStatus]=useState(true)
  return (
    <div className='flex w-[100vw] h-[100vh]'>
        <div className='w-[50%] h-[100%] flex flex-col items-center bg-[#17A2B8]'>
            <img src="./Art.png"/>
          <h3 className='text-white text-2xl'>Welcome aboard my friend</h3>
          <p className='text-white text-2xl'>just a couple of clicks and we start</p>
        </div>
        {
            loginStatus?<LoginComponents setLoginStatus={setLoginStatus}/>:<RegisterComponents setLoginStatus={setLoginStatus}/>
        }
    </div>
  )
}

export default Home