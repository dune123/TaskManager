import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const AddBoardUser = ({setAddBUser}) => {
    const [boardEmail,setBoardEmail]=useState("")
    const token=localStorage.getItem('token')

    async function addBoardUserToTheUser(){
        try {
            await axios.post('https://promanagerbakend-production.up.railway.app/api/user/addBoardUser',{boardUserEmail:boardEmail},{
                headers: {
                    Authorization: `Bearer ${token}`,
                  }
            })

            toast.success("board user added")
            setAddBUser(false)
        } catch (error) {
            toast.error(error.message)
        }
    }
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000] flex justify-center items-center">
      <div className="w-[42.5vw] h-[29vh] bg-white flex flex-col gap-[2vh] pt-[3vh] px-[2vw] rounded-md">
        <h1 className='text-2xl font-bold'>Add Board User</h1>
        <input onChange={(e)=>setBoardEmail(e.target.value)} type="text" placeholder='enter the email' className='p-1 border-2 border-[#767575] rounded-md'/>
        <div className='flex justify-between '>
        <button className='bg-white border-red-500 border-2 text-red-500 rounded-md w-[47%] h-10' onClick={()=>setAddBUser(false)}>Cancel</button>
        <button className='bg-[#17A2B8] text-white border-none rounded-md w-[47%] h-10' onClick={addBoardUserToTheUser}>Add Email</button>
      </div>
      </div>
      </div>
  )
}

export default AddBoardUser