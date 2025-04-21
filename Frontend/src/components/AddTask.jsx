import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";
import { GoDotFill } from "react-icons/go";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdDelete } from "react-icons/md";
import { CiTextAlignJustify } from "react-icons/ci";

const AddTaskStage = () => (
  <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000] flex justify-center items-center">
    <div className="w-[42.5vw] h-[30vh] bg-white flex flex-col gap-[2vh] pt-[3vh] px-[2vw] rounded-md">
      <div className="flex flex-col items-center gap-4 pt-6">
        <FiLoader className="size-6 text-red-500 animate-spin" />
        <h3 className="text-red-400 text-xl font-bold">Adding your task</h3>
      </div>
    </div>
  </div>
);
const AddTask = ({ setAddTask, getAllTask }) => {
   // All hooks must come first
   const [loading, setLoading] = useState(false);
   const [showSug, setShowSug] = useState(false);
   const [loadingSuggestion, setLoadingSuggestion] = useState(false);
   const [suggestions, setSuggestions] = useState([]);
   const [boardUser, setBoardUser] = useState([]);
   const [checklistArr, setChecklistArr] = useState([]);
   const [taskData, setTaskData] = useState({
     taskName: "",
     checkList: [],
     dueDate: "",
     priority: "",
     assignedEmail: "None",
     status: "todo",
   });

  useEffect(() => {
    getBoardUsers();
  }, []);

  const token = localStorage.getItem("token");

  async function handleAddTask() {
    if(taskData.taskName.length<5){
      toast.error("title should be atleast 5 characters long")
      return;
    }
    if(taskData.priority==""){
      toast.error("priority should be there")
      return
    }
    if(!taskData.checkList){
      return res.status(404).json({message:"please provide checklist"})
    }
    else{
      if (!Array.isArray(taskData.checkList)) {
        toast.error("Checklist should be an array")
        return
      }
      
      for (const item of taskData.checkList) {
        if (item.description.trim() === "") {
          toast.error("Checklist item cannot be empty")
          return;
        }
      }
    }
    if(taskData.dueDate==""){
      toast.error("Due date is required.");
      return;
    }
    if(taskData.dueDate<Date.now()){
      toast.error("Due date can not be less than today")
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "https://promanagerbakend-production.up.railway.app/api/task/createTask",
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status == 201) {
        toast.success(res.data.message);
        getAllTask();
        setAddTask(false);
        setShowSug(false);
      } else {
        toast.error(res.data.message);
      }
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function getBoardUsers() {
    try {
      const response = await axios.get(
        "https://promanagerbakend-production.up.railway.app/api/user/getBoardUser",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBoardUser(response.data.boardUser);
    } catch (error) {
      toast.error(error.message);
    }
  }

  function ChangeDescription(index, value) {
    const updatedChecklist = checklistArr.map((item, ind) => {
      if (ind === index) {
        return { ...item, description: value };
      }
      return item;
    });

    setChecklistArr(updatedChecklist);
    setTaskData((prev) => ({
      ...prev,
      checkList: updatedChecklist,
    }));
  }

  function deleteCheckList(index) {
    const updatedChecklist = checklistArr.filter((_, ind) => ind !== index);

    setChecklistArr(updatedChecklist);
    setTaskData((prev) => ({
      ...prev,
      checkList: updatedChecklist,
    }));
  }

  async function getSuggestion() {
    const taskName = taskData.taskName;
    setShowSug(true);
    try {
      setLoadingSuggestion(true);
      const response = await axios.get(
        `https://promanagerbakend-production.up.railway.app/api/task/checklistsuggestion/${taskName}`
      );

      // Assuming API returns { suggestions: ["Step 1", "Step 2", ...] }
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      setSuggestions([]);
    } finally {
      setLoadingSuggestion(false);
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (taskData.taskName.length >= 6) {
        getSuggestion();
      }
    }, 500); // 500ms debounce delay
  
    return () => clearTimeout(delayDebounce); // Cleanup on every keystroke
  }, [taskData.taskName]);


  if (loading) {
    return <AddTaskStage />;
  }


  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000] flex justify-center items-center">
      {showSug &&
        (loadingSuggestion ? (
          <div className="text-black bg-white p-10 absolute top-1 right-1 rounded-md">
            suggestion loading....
          </div>
        ) : (
          <div className="text-black bg-white p-2 absolute top-1 right-1 rounded-md w-[15vw] flex flex-col gap-1">
            {suggestions.map((item, index) => (
              <ul key={index}>
                <li>{item}</li>
              </ul>
            ))}
            <button
              onClick={() => {
                setShowSug(false);
              }}
              className="border-2 border-red-500 text-red-500 p-2 rounded-md"
            >
              don't show suggestion
            </button>
          </div>
        ))}
      <div className="w-[50vw] h-[68vh] bg-white flex flex-col gap-[2vh] pt-[3vh] px-[2vw] rounded-md">
        <div className="flex flex-col gap-2">
          <div>
            <label>Title: </label>
            <input
              type="text"
              placeholder="Enter Task Name"
              className="border-[#EEF2F5] border-2 rounded-md w-[98%] p-2"
              onChange={(e) =>
                setTaskData((prev) => ({
                  ...prev,
                  taskName: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex gap-2 items-center">
            <label>Priority:</label>
            <div
              onClick={() =>
                setTaskData((prev) => ({ ...prev, priority: "high" }))
              }
              className="border-1 rounded-md flex p-1 items-center border-[#E2E2E2] cursor-pointer"
              style={{
                backgroundColor:
                  taskData.priority === "high" ? "#EEECEC" : "white",
              }}
            >
              <GoDotFill className="text-[#FF2473]" /> High Priority
            </div>
            <div
              onClick={() =>
                setTaskData((prev) => ({ ...prev, priority: "moderate" }))
              }
              className="border-1 rounded-md flex p-1 items-center border-[#E2E2E2] cursor-pointer"
              style={{
                backgroundColor:
                  taskData.priority === "moderate" ? "#EEECEC" : "white",
              }}
            >
              <GoDotFill className="text-[#18B0FF]" /> Moderate Priority
            </div>
            <div
              onClick={() =>
                setTaskData((prev) => ({ ...prev, priority: "low" }))
              }
              className="border-1 rounded-md flex p-1 items-center border-[#E2E2E2] cursor-pointer"
              style={{
                backgroundColor:
                  taskData.priority === "low" ? "#EEECEC" : "white",
              }}
            >
              <GoDotFill className="text-[#63C05B]" /> Low Priority
            </div>
          </div>

          {/* Assigned user */}
          <div>
            <label>Assigned User:</label>
            <select
              value={taskData.assignedEmail}
              onChange={(e) =>
                setTaskData((prev) => ({
                  ...prev,
                  assignedEmail: e.target.value,
                }))
              }
            >
              <option value="None">None</option>
              {boardUser &&
                boardUser.map((item, index) => (
                  <option key={index} value={item.email}>
                    {item.email}
                  </option>
                ))}
            </select>
          </div>

          {/* Checklist */}
          <div className="flex flex-col gap-1 items-start">
            <label>Checklist:</label>
            <button
              className="text-[#E2E2E2]"
              onClick={() => {
                const updatedChecklist = [
                  ...checklistArr,
                  { checked: false, description: "" },
                ];

                setChecklistArr(updatedChecklist);
                setTaskData((prev) => ({
                  ...prev,
                  checkList: updatedChecklist,
                }));
              }}
            >
              + Add Task
            </button>
            <div className="flex flex-col gap-1 h-[25vh] overflow-auto w-[100%]">
              {checklistArr &&
                checklistArr.map((item, index) => (
                  <div
                    key={index}
                    className="border-[#E2E2E2] border-1 p-1 rounded-md flex gap-1"
                  >
                    <input
                      type="checkbox"
                      value={checklistArr[index].checked}
                    />
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => ChangeDescription(index, e.target.value)}
                      className="w-[100%]"
                    />
                    <MdDelete
                      className="text-red-500 cursor-pointer"
                      onClick={() => deleteCheckList(index)}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Bottom container */}
          <div className="flex w-[100%] justify-between">
            <DatePicker
              placeholderText="Select due date"
              onChange={(date) =>
                setTaskData((prev) => ({ ...prev, dueDate: date }))
              }
              selected={taskData.dueDate}
            />
            <div className="flex gap-2">
              <button
                className="bg-white text-red-500 p-2 rounded-lg border-red-500 border-1 w-40 cursor-pointer"
                onClick={() => setAddTask(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="bg-[#17A2B8] border-none border-2 text-white p-2 w-40 rounded-lg cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
