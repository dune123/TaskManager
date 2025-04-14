import React, { useEffect, useState } from 'react';
import AddTask from '../components/AddTask';
import axios from 'axios';
import { toast } from 'react-toastify';
import TaskCard from '../components/TaskCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [addTask, setAddTask] = useState(false);
  const [todo, setTodo] = useState([]);
  const [backlog, setBacklog] = useState([]);
  const [done, setDone] = useState([]);
  const token = localStorage.getItem('token');
  const navigate=useNavigate()

  async function getAllTask() {
    try {
      const response = await axios.get('https://promanagerbakend.onrender.com/api/task/getTask', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const tasks = response.data.tasks; // assuming response contains tasks here
      // Clear existing state
      setTodo([]);
      setBacklog([]);
      setDone([]);

      tasks.forEach((item) => {
        if (item.status === 'todo') {
          setTodo((prev) => [...prev, item]);
        } else if (item.status === 'backlog') {
          setBacklog((prev) => [...prev, item]);
        } else if (item.status === 'done') {
          setDone((prev) => [...prev, item]);
        }
      });

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  async function Logout(){
    try {
      await axios.post('https://promanagerbakend.onrender.com/api/user/logout',{},{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      navigate('/')
      toast.success("successfully logged out")
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  useEffect(() => {
    getAllTask();
  }, []);

  return (
    <>
      <div className="w-full h-full flex">
        {/* Sidebar */}
        <div className="w-[15%] flex flex-col justify-between items-center p-10 border-r-2">
          <h1 className="text-2xl font-bold">ProManager</h1>
          <h1 className='text-2xl font-bold cursor-pointer' onClick={Logout}>Logout</h1>
        </div>

        {/* Main Content */}
        <div className="flex flex-col p-10 w-[85%]">
          <h1 className="font-bold text-xl mb-4">Task Manager</h1>

          <button className="bg-black text-white px-4 py-2 rounded-2xl mb-6 w-fit" onClick={() => setAddTask(true)}>
            Add Task
          </button>

          <div className="flex gap-6 overflow-x-auto">
            {/* To-do Column */}
            <div className="w-[30vw] h-[75vh] bg-[#EEF2F5] rounded-2xl p-4 overflow-y-auto">
              <h2 className="text-xl font-bold mb-3">To-do</h2>
              {todo.map((item, index) => <TaskCard key={index} item={item} getAllTask={getAllTask} />)}
            </div>

            {/* Backlog Column */}
            <div className="w-[30vw] h-[75vh] bg-[#EEF2F5] rounded-2xl p-4 overflow-y-auto">
              <h2 className="text-xl font-bold mb-3">Backlog</h2>
              {backlog.map((item, index) => <TaskCard key={index} item={item} getAllTask={getAllTask} />)}
            </div>

            {/* Done Column */}
            <div className="w-[30vw] h-[75vh] bg-[#EEF2F5] rounded-2xl p-4 overflow-y-auto">
              <h2 className="text-xl font-bold mb-3">Done</h2>
              {done.map((item, index) => <TaskCard key={index} item={item} getAllTask={getAllTask} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {addTask && <AddTask setAddTask={setAddTask} getAllTask={getAllTask}/>}
    </>
  );
};

export default Dashboard;
