import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';

const DeletingTask=()=>(
  <div className='fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000] flex justify-center items-center'>
      <div className='w-[42.5vw] h-[30vh] bg-white flex flex-col gap-[2vh] pt-[3vh] px-[2vw] rounded-md'>
        <div className='flex flex-col items-center gap-4 pt-6'>
          <FiLoader className='size-6 text-red-500 animate-spin' />
          <h3 className='text-red-400 text-xl font-bold'>Deleting your task</h3>
        </div>
      </div>
    </div>
)

const ModalDelete=({setModalDelete,getAllTask,taskId})=>{
  const [loading,setLoading]=useState(false)
  const token=localStorage.getItem("token")
  async function deleteTask(){
    try {
      setLoading(true)
      await axios.delete('https://promanagerbakend.onrender.com/api/task/deleteTask', {
        data: { taskId },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      getAllTask()
      setModalDelete(false);
      toast.success("Task deleted successfully")
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
    finally{
      setLoading(false);
    }
  }

  if(loading) return <DeletingTask/>

  return(
  <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000] flex justify-center items-center">
    <div className="w-[30vw] h-[20vh] bg-white flex flex-col gap-[2vh] pt-[3vh] px-[2vw] rounded-md">
      <p>Are you sure you want to delete</p>
      <div className='flex gap-2'>
      <button className='border-2 border-red-500 p-2 rounded-md' onClick={()=>setModalDelete(false)}>Cancel</button>
      <button className='bg-red-500 text-white p-2 rounded-md' onClick={deleteTask}>Delete</button>
      </div>
    </div>
  </div>
)}

const ChangingTask=()=>(
  <div className='fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000] flex justify-center items-center'>
      <div className='w-[42.5vw] h-[30vh] bg-white flex flex-col gap-[2vh] pt-[3vh] px-[2vw] rounded-md'>
        <div className='flex flex-col items-center gap-4 pt-6'>
          <FiLoader className='size-6 text-red-500 animate-spin' />
          <h3 className='text-red-400 text-xl font-bold'>Changing your task</h3>
        </div>
      </div>
    </div>
)

const TaskCard = ({ item,getAllTask }) => {
  const [modalDelete,setModalDelete]=useState(false);
  const [loading,setLoading]=useState(false);
  const token=localStorage.getItem("token")
  async function changeStatus(taskValue,taskId){
    setLoading(true);
    try {
      await axios.post('https://promanagerbakend.onrender.com/api/task/changeStatus',{
        taskId,
        newStatus:taskValue
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      getAllTask()
      toast.success("status changed successfully")
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
    finally{
      setLoading(false)
    }
  }

  if(loading) return <ChangingTask/>
  
  return (
    <>
    <div className="bg-white rounded-md p-4 shadow mb-4">
      <h1 className="font-semibold">{item.taskName}</h1>
      <p>{item.description}</p>
      <div>Status: <select value={item.status} onChange={(e)=>changeStatus(e.target.value,item._id)}>
        <option>todo</option>
        <option>backlog</option>
        <option>done</option>
      </select></div>

      <button className='bg-red-500 p-1 border-none rounded-md text-white' onClick={()=>setModalDelete(true)}>delete</button>
    </div>
    {
      modalDelete&&(<ModalDelete setModalDelete={setModalDelete} getAllTask={getAllTask} taskId={item._id}/>)
    }
    </>)
};

export default TaskCard