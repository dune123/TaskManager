import React, { useEffect, useState } from 'react';
import AddTask from '../components/AddTask';
import axios from 'axios';
import { toast } from 'react-toastify';
import TaskCard from '../components/TaskCard';
import { useNavigate } from 'react-router-dom';
import { GoPeople } from "react-icons/go";
import { FaVectorSquare } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import AddBoardUser from '../components/AddBoardUser';

const Dashboard = () => {
  const [addTask, setAddTask] = useState(false);
  const [addBUser,setAddBUser]=useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [todo, setTodo] = useState([]);
  const [backlog, setBacklog] = useState([]);
  const [done, setDone] = useState([]);
  const [progress,setProgress]=useState([])
  const [changeDateFilter,setChangeDateFilter]=useState("this year")
  const token = localStorage.getItem('token');
  const Username=localStorage.getItem('Username')

  const navigate=useNavigate()

  async function getAllTask() {
    try {
      const response = await axios.get('https://promanagerbakend.onrender.com/api/task/getTask', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const tasks = response.data.tasks;
    setAllTasks(tasks); // Save all tasks to a master list

    // Initial filter when tasks are loaded
    filterTaskAcc(tasks, changeDateFilter);

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

  {/* curr date format */}
  function formatDateToMonthDay(isoDateStr) {
    const date = new Date(isoDateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
  
    // Helper to get ordinal suffix
    function getOrdinalSuffix(n) {
      if (n >= 11 && n <= 13) return "th";
      const lastDigit = n % 10;
      if (lastDigit === 1) return "st";
      if (lastDigit === 2) return "nd";
      if (lastDigit === 3) return "rd";
      return "th";
    }
  
    return `${month} ${day}${getOrdinalSuffix(day)}`;
  }

  function filterTaskAcc(tasks, filterType) {
    const now = new Date();
    let end;
  
    if (filterType === 'this week') {
      end = new Date();
      end.setDate(now.getDate() + 7);
    } else if (filterType === 'this month') {
      end = new Date();
      end.setMonth(now.getMonth() + 1);
    } else if (filterType === 'this year') {
      end = new Date();
      end.setFullYear(now.getFullYear() + 1);
    }
  
    const filtered = tasks.filter(task => {
      const due = new Date(task.duedate); // ✅ Correct field name
      return due >= now && due <= end;
    });
  
    console.log("filtered", filtered);
  
    setTodo([]);
    setBacklog([]);
    setDone([]);
    setProgress([]);
  
    filtered.forEach((item) => {
      if (item.status === 'todo') {
        setTodo(prev => [...prev, item]);
      } else if (item.status === 'backlog') {
        setBacklog(prev => [...prev, item]);
      } else if (item.status === 'done') {
        setDone(prev => [...prev, item]);
      } else if (item.status === 'inprogress') {
        setProgress(prev => [...prev, item]);
      }
    });
  }
  
  
  useEffect(() => {
    if (allTasks.length > 0) {
      filterTaskAcc(allTasks,changeDateFilter);
    }
  }, [changeDateFilter]);

  useEffect(() => {
    getAllTask();
  }, []);

  return (
    <>
      <div className="w-full h-full flex">
        {/* Sidebar */}
        <div className="w-[15%] flex flex-col justify-between items-center p-10 border-r-2">
          <h1 className="text-2xl font-bold">ProManager</h1>
          <button className='flex items-center gap-1 cursor-pointer text-red-500 text-2xl' onClick={Logout}><IoIosLogOut/> Logout</button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col p-4 w-[85%]">
        <div className='w-[100%] p-2 flex justify-between'>
          <h1 className="font-bold text-3xl mb-4">Welcome, {Username}</h1>
          <h1 className='text-2xl'>{formatDateToMonthDay(Date.now())}</h1>
        </div>
        <div className='w-[100%] p-2 flex justify-between'>
        <div className='flex gap-2 items-center'>
          <h1 className="font-semibold text-3xl mb-4">Board</h1>
          <div className='flex gap-0.5 items-center text-[#707070] cursor-pointer' onClick={()=>setAddBUser(true)}><GoPeople/>Add People</div>
        </div>
        {/* Date Filters */}
          <select value={changeDateFilter} onChange={(e) => setChangeDateFilter(e.target.value)}>
            <option value="this week">This Week</option>
            <option value="this month">This Month</option>
            <option value="this year">This Year</option>
          </select>
        </div>

          <div className="flex gap-6 overflow-x-auto">
             {/* Backlog Column */}
             <div className="w-[30vw] h-[75vh] bg-[#EEF2F5] rounded-2xl ,overflow-y-auto p-2">
            <div className='flex justify-between p-4 items-center'>
              <h2 className="text-xl font-bold mb-3">Backlog</h2>
              </div>
              {backlog.map((item, index) => <TaskCard key={index} item={item} getAllTask={getAllTask} />)}
            </div>

            {/* To-do Column */}
            <div className="w-[30vw] h-[75vh] bg-[#EEF2F5] rounded-2xl overflow-y-auto p-2">
              <div className='flex justify-between p-4 items-center'>
              <h2 className="text-xl font-bold mb-3">To-do</h2>
              <div className='flex gap-2 items-center'>
              <button className=' text-red-500 border-red-500 cursor-pointer' onClick={()=>setAddTask(true)}>Add task</button>
              </div>
              </div>
              {todo.map((item, index) => <TaskCard key={index} item={item} getAllTask={getAllTask} />)}
            </div>

            {/* In progress */}
            <div className="w-[30vw] h-[75vh] bg-[#EEF2F5] rounded-2xl ,overflow-y-auto p-2">
            <div className='flex justify-between p-4 items-center'>
              <h2 className="text-xl font-bold mb-3">In progess</h2>
              </div>
              {progress.map((item, index) => <TaskCard key={index} item={item} getAllTask={getAllTask} />)}
            </div>

            {/* Done Column */}
            <div className="w-[30vw] h-[75vh] bg-[#EEF2F5] rounded-2xl  overflow-y-auto p-2">
            <div className='flex justify-between p-4 items-center'>
              <h2 className="text-xl font-bold mb-3">Done</h2>
              </div>
              {done.map((item, index) => <TaskCard key={index} item={item} getAllTask={getAllTask} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {addTask && <AddTask setAddTask={setAddTask} getAllTask={getAllTask}/>}

      {/* Add Board User */}
      {
        addBUser &&<AddBoardUser setAddBUser={setAddBUser}/>
      }
    </>
  );
};

export default Dashboard;
