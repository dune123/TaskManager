import axios from 'axios';
import React, { useState } from 'react'
import { FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AddTaskStage=()=>(
  <div className='fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000] flex justify-center items-center'>
      <div className='w-[42.5vw] h-[30vh] bg-white flex flex-col gap-[2vh] pt-[3vh] px-[2vw] rounded-md'>
        <div className='flex flex-col items-center gap-4 pt-6'>
          <FiLoader className='size-6 text-red-500 animate-spin' />
          <h3 className='text-red-400 text-xl font-bold'>Adding your task</h3>
        </div>
      </div>
    </div>
)
const AddTask = ({setAddTask,getAllTask}) => {
  const [loading,setLoading]=useState(false);
  const [taskData,setTaskData]=useState({
    taskName:"",
    description:"",
    dueDate:"",
    status:""
  })

  console.log(taskData)
  const token=localStorage.getItem("token")

  async function AddTask(){
    setLoading(true)
    try {
      const res=await axios.post('https://promanagerbakend.onrender.com/api/task/createTask',taskData,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      if(res.status==201){
        toast.success(res.data.message)
        getAllTask()
        setAddTask(false);
     }
     else{
       toast.error(res.data.message)
     }
     setLoading(false);
    }
      catch (error) {
        toast.error(error.message);
        setLoading(false)
    }
    finally{
      setLoading(false)
    }
    }

    if(loading){
       return <AddTaskStage/>
    }
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000] flex justify-center items-center">
      <div className="w-[42.5vw] h-[50vh] bg-white flex flex-col gap-[2vh] pt-[3vh] px-[2vw] rounded-md">
        <div className='flex flex-col gap-2'>
          <input type="text" placeholder='Task Name' className='border-[#EEF2F5] border-2 rounded-md w-[98%] p-2' onChange={(e)=>setTaskData((prev)=>({
            ...prev,
            taskName:e.target.value
          }))}/>
         <textarea type="Task Description" className='border-[#EEF2F5] border-2 rounded-md w-[98%] p-2' onChange={(e)=>setTaskData((prev)=>({
          ...prev,
          description:e.target.value
         }))}/>
         <input type="date" placeholder='Due Date' onChange={(e)=>setTaskData((prev)=>({
          ...prev,
          dueDate:e.target.value
         }))} 
         className='border-[#EEF2F5] border-2 p-2'/>
         <select className='border-[#EEF2F5] border-2 p-2' onChange={(e)=>setTaskData((prev)=>({
          ...prev,
          status:e.target.value
         }))}>
          <option>todo</option>
          <option>backlog</option>
          <option>done</option>
         </select>
         <div className='flex gap-4'>
            <button className='bg-black text-white p-2 w-[20vw] rounded-lg border-none' onClick={()=>setAddTask(false)}>Cancel</button>
            <button onClick={AddTask} className='bg-white border-black border-2 text-black p-2 w-[20vw] rounded-lg'>Add Task</button>
         </div>
        </div>
      </div>
    </div>
  )
}

export default AddTask