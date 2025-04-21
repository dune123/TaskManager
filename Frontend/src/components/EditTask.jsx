import axios from "axios";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { FiLoader } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const EditingTask = () => (
  <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000] flex justify-center items-center">
    <div className="w-[42.5vw] h-[30vh] bg-white flex flex-col gap-[2vh] pt-[3vh] px-[2vw] rounded-md">
      <div className="flex flex-col items-center gap-4 pt-6">
        <FiLoader className="size-6 text-red-500 animate-spin" />
        <h3 className="text-red-400 text-xl font-bold">Editing your task</h3>
      </div>
    </div>
  </div>
);

const EditTask = ({ setEditTaskModel, editableTask, getAllTask }) => {
  const [boardUser, setBoardUser] = useState([]);
  const [checklistArr, setChecklistArr] = useState(editableTask.checklist);
  const [task, setTask] = useState(editableTask);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

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

  async function EditTask() {
    const taskId = editableTask._id;
    setLoading(true);
    try {
      const res = await axios.put(
        `https://promanagerbakend-production.up.railway.app/api/task/editTask/${taskId}`,
        {
          task,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || "Task updated successfully!");
      getAllTask();
      setEditTaskModel(false);
      setEditTaskModel(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBoardUsers();
  }, []);

  console.log(task);

  function deleteCheckList(index) {
    const updatedChecklist = checklistArr.filter((_, ind) => ind !== index);

    setChecklistArr(updatedChecklist);
    setTask((prev) => ({
      ...prev,
      checklist: updatedChecklist,
    }));
  }

  function ChangeDescription(ind, value) {
    const updatedChecklist = checklistArr.map((item, index) => {
      if (index === ind) {
        return { checked: false, description: value };
      }
      return item;
    });

    setChecklistArr(updatedChecklist);
    setTask((prev) => ({
      ...prev,
      checklist: updatedChecklist,
    }));
  }

  function changeCheckedStatus(index) {
    const updatedChecklist = [...checklistArr].map((item, ind) => {
      if (ind == index) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    setChecklistArr(updatedChecklist);

    setTask((prev) => ({
      ...prev,
      checklist: updatedChecklist,
    }));
  }

  console.log("task", task);

  if (loading) {
    return <EditingTask />;
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000] flex justify-center items-center">
      <div className="w-[50vw] h-[72vh] bg-white flex flex-col gap-[2vh] pt-[3vh] px-[2vw] rounded-md">
        {/* title container */}
        <div className="flex flex-col gap-1">
          <lable className="text-2xl font-semibold">Title</lable>
          <input
            type="text"
            value={task.taskName}
            className="border-2 border-[#4D40551A] p-1 rounded-md"
            onChange={(e) =>
              setTask((prev) => ({
                ...prev,
                taskName: e.target.value,
              }))
            }
          />
        </div>

        {/* priority section */}
        <div className="flex gap-2 items-center">
          <label>Priority:</label>
          <div
            className="border-1 rounded-md flex p-1 items-center border-[#E2E2E2] cursor-pointer"
            style={{
              backgroundColor: task.priority === "high" ? "#EEECEC" : "white",
            }}
            onClick={() =>
              setTask((prev) => ({
                ...prev,
                priority: "high",
              }))
            }
          >
            <GoDotFill className="text-[#FF2473]" /> High Priority
          </div>
          <div
            className="border-1 rounded-md flex p-1 items-center border-[#E2E2E2] cursor-pointer"
            style={{
              backgroundColor:
                task.priority === "moderate" ? "#EEECEC" : "white",
            }}
            onClick={() =>
              setTask((prev) => ({
                ...prev,
                priority: "moderate",
              }))
            }
          >
            <GoDotFill className="text-[#18B0FF]" /> Moderate Priority
          </div>
          <div
            className="border-1 rounded-md flex p-1 items-center border-[#E2E2E2] cursor-pointer"
            style={{
              backgroundColor: task.priority === "low" ? "#EEECEC" : "white",
            }}
            onClick={() =>
              setTask((prev) => ({
                ...prev,
                priority: "low",
              }))
            }
          >
            <GoDotFill className="text-[#63C05B]" /> Low Priority
          </div>
        </div>

        {/* assigned user section */}
        <div>
          <label>Assigned User:</label>
          <select
            value={task.assigned}
            onChange={(e) =>
              setTask((prev) => ({ ...prev, assigned: e.target.value }))
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

        {/* checklist edit */}
        <div className="flex flex-col gap-1 items-start">
          <label>Checklist:</label>
          <button
            className="text-[#E2E2E2] cursor-pointer"
            onClick={() => {
              const updatedChecklist = [
                ...checklistArr,
                { checked: false, description: "" },
              ];

              setChecklistArr(updatedChecklist);
              setTask((prev) => ({
                ...prev,
                checklist: updatedChecklist,
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
                    checked={item.checked}
                    onChange={() => changeCheckedStatus(index)}
                  />
                  <input
                    type="text"
                    value={item.description}
                    className="w-[100%]"
                    onChange={(e) => ChangeDescription(index, e.target.value)}
                  />
                  <MdDelete
                    className="text-red-500 cursor-pointer"
                    onClick={() => deleteCheckList(index)}
                  />
                </div>
              ))}
          </div>
        </div>
        {/* bottom container */}

        {/* Bottom container */}
        <div className="flex w-[100%] justify-between">
          <DatePicker
            placeholderText="Select due date"
            selected={task.duedate}
            onChange={(date) => setTask((prev) => ({ ...prev, duedate: date }))}
          />
          <div className="flex gap-2">
            <button
              className="bg-white text-red-500 p-2 rounded-lg border-red-500 border-1 w-40 cursor-pointer"
              onClick={() => setEditTaskModel(false)}
            >
              Cancel
            </button>
            <button
              className="bg-[#17A2B8] border-none border-2 text-white p-2 w-40 rounded-lg cursor-pointer"
              onClick={EditTask}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
