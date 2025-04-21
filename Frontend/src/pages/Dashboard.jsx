import React, { useEffect, useState } from "react";
import AddTask from "../components/AddTask";
import axios from "axios";
import { toast } from "react-toastify";
import TaskCard from "../components/TaskCard";
import { useNavigate } from "react-router-dom";
import { GoPeople } from "react-icons/go";
import { IoIosLogOut } from "react-icons/io";
import AddBoardUser from "../components/AddBoardUser";
import AnalyticsSection from "../components/AnalyticsSection";
import SettingSection from "../components/SettingSection";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { GrAnalytics } from "react-icons/gr";
import { IoIosSettings } from "react-icons/io";
import { FiLoader } from "react-icons/fi";

const ChangingTask = () => (
  <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000] flex justify-center items-center">
    <div className="w-[42.5vw] h-[30vh] bg-white flex flex-col gap-[2vh] pt-[3vh] px-[2vw] rounded-md">
      <div className="flex flex-col items-center gap-4 pt-6">
        <FiLoader className="size-6 text-red-500 animate-spin" />
        <h3 className="text-red-400 text-xl font-bold">Changing your task</h3>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [isDashboard, setIsDashboard] = useState(true);
  const [isAnalystics, setIsAnalytics] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSetting, setIsSetting] = useState(false);
  const [addTask, setAddTask] = useState(true);
  const [addBUser, setAddBUser] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [todo, setTodo] = useState([]);
  const [backlog, setBacklog] = useState([]);
  const [done, setDone] = useState([]);
  const [progress, setProgress] = useState([]);
  const [changeDateFilter, setChangeDateFilter] = useState("this year");

  const token = localStorage.getItem("token");
  const Username = localStorage.getItem("Username");
  const navigate = useNavigate();

  async function getAllTask() {
    try {
      const response = await axios.get(
        "https://promanagerbakend-production.up.railway.app/api/task/getTask",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const tasks = response.data.tasks;
      setAllTasks(tasks); // Save all tasks to a master list
      filterTaskAcc(tasks, changeDateFilter);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  async function Logout() {
    try {
      await axios.post(
        "https://promanagerbakend-production.up.railway.app/api/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/");
      toast.success("Successfully logged out");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  // Format current date
  function formatDateToMonthDay(isoDateStr) {
    const date = new Date(isoDateStr);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];

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
  
    if (filterType === "this week") {
      end = new Date();
      end.setDate(now.getDate() + 7);
    } else if (filterType === "this month") {
      end = new Date();
      end.setMonth(now.getMonth() + 1);
    } else if (filterType === "this year") {
      end = new Date();
      end.setFullYear(now.getFullYear() + 1);
    }
  
    const filtered = tasks.filter((task) => {
      const due = new Date(task.duedate);
      return due >= now && due <= end;
    });
  
    // Instead of setting state in a loop, calculate all at once
    const newTodo = [];
    const newBacklog = [];
    const newDone = [];
    const newProgress = [];
  
    const priorityOrder = { high: 3, medium: 2, low: 1 };
  
    // Sort by priority (high to low)
    const sorted = [...filtered].sort((a, b) => {
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    });
  
    sorted.forEach((item) => {
      if (item.status === "todo") {
        newTodo.push(item);
      } else if (item.status === "backlog") {
        newBacklog.push(item);
      } else if (item.status === "done") {
        newDone.push(item);
      } else if (item.status === "inprogress") {
        newProgress.push(item);
      }
    });
  
    // Update all states at once
    setTodo(newTodo);
    setBacklog(newBacklog);
    setDone(newDone);
    setProgress(newProgress);
  }

  useEffect(() => {
    if (allTasks.length > 0) {
      filterTaskAcc(allTasks, changeDateFilter);
    }
  }, [changeDateFilter]);

  useEffect(() => {
    getAllTask();
  }, []);

  function analysticsClick() {
    setIsDashboard(false);
    setIsSetting(false);
    setIsAnalytics(true);
  }

  function dashboardClick() {
    setIsAnalytics(false);
    setIsSetting(false);
    setIsDashboard(true);
  }

  function settingClick() {
    setIsAnalytics(false);
    setIsDashboard(false);
    setIsSetting(true);
  }

  // Drag and drop handlers
  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("task", JSON.stringify(task));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const task = JSON.parse(e.dataTransfer.getData("task"));
    const newStatus = targetStatus;

    try {
      setLoading(true);

      // Handle status change with API
      await axios.post(
        "https://promanagerbakend-production.up.railway.app/api/task/changeStatus",
        { taskId: task._id, newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await getAllTask();

      toast.success("Task status updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <ChangingTask />}
      <div className="w-full h-full flex">
        {/* Sidebar */}
        <div className="w-[15%] flex flex-col items-center gap-10">
          <h1 className="text-2xl font-bold mt-8">ProManager</h1>
          <div className="flex flex-col justify-between h-full w-[100%]">
            <div className="flex flex-col gap- w-[100%]">
              <button
                className="flex gap-2 items-center text-xl cursor-pointer w-[100%] p-2 pl-8"
                style={{ background: isDashboard ? "#4391ED1A" : "white" }}
                onClick={dashboardClick}
              >
                <MdOutlineSpaceDashboard /> DashBoard
              </button>
              <button
                className="flex gap-2 items-center text-xl cursor-pointer p-2 pl-8"
                style={{ background: isAnalystics ? "#4391ED1A" : "white" }}
                onClick={analysticsClick}
              >
                <GrAnalytics /> Analytics
              </button>
              <button
                className="flex gap-2 items-center text-xl cursor-pointer p-2 pl-8"
                style={{ background: isSetting ? "#4391ED1A" : "white" }}
                onClick={settingClick}
              >
                <IoIosSettings /> Settings
              </button>
            </div>
            <button
              className="flex items-center gap-1 cursor-pointer text-red-500 text-2xl p-10"
              onClick={Logout}
            >
              <IoIosLogOut /> Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        {isAnalystics ? (
          <AnalyticsSection />
        ) : isSetting ? (
          <SettingSection />
        ) : (
          <div className="flex flex-col p-4 w-[85%] h-full">
            <div className="w-full p-2 flex justify-between">
              <h1 className="font-bold text-3xl mb-4">Welcome, {Username}</h1>
              <h1 className="text-2xl">{formatDateToMonthDay(Date.now())}</h1>
            </div>

            <div className="w-full p-2 flex justify-between">
              <div className="flex gap-2 items-center">
                <h1 className="font-semibold text-3xl mb-4">Board</h1>
                <div
                  className="flex gap-0.5 items-center text-[#707070] cursor-pointer"
                  onClick={() => setAddBUser(true)}
                >
                  <GoPeople />
                  Add People
                </div>
              </div>

              {/* Date Filters */}
              <select
                value={changeDateFilter}
                onChange={(e) => setChangeDateFilter(e.target.value)}
              >
                <option value="this week">This Week</option>
                <option value="this month">This Month</option>
                <option value="this year">This Year</option>
              </select>
            </div>

            <div className="flex gap-6 overflow-x-auto">
              {/* Columns: Backlog, Todo, In Progress, Done */}
              {[
                { title: "Backlog", tasks: backlog, status: "backlog" },
                { title: "To-do", tasks: todo, status: "todo" },
                { title: "In progress", tasks: progress, status: "inprogress" },
                { title: "Done", tasks: done, status: "done" },
              ].map(({ title, tasks, status }, idx) => (
                <div
                  key={idx}
                  className="w-[30vw] h-[75vh] bg-[#EEF2F5] rounded-2xl overflow-y-auto p-2"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  <div className="flex justify-between p-4 items-center">
                    <h2 className="text-xl font-bold mb-3">{title}</h2>
                    {title === "To-do" && (
                      <button
                        className="text-red-500 border-red-500 cursor-pointer border-2 rounded-md p-1"
                        onClick={() => setAddTask(true)}
                      >
                        Add task
                      </button>
                    )}
                  </div>
                  {tasks.map((item, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                    >
                      <TaskCard
                        key={item._id}
                        item={item}
                        getAllTask={getAllTask}
                        draggable
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {addTask && <AddTask setAddTask={setAddTask} getAllTask={getAllTask} />}

      {/* Add Board User Modal */}
      {addBUser && <AddBoardUser setAddBUser={setAddBUser} />}
    </>
  );
};

export default Dashboard;
