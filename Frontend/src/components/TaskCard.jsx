import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { toast } from "react-toastify";
import {
  CiEdit,
  CiShare2,
  CiSquareChevDown,
  CiSquareChevUp,
} from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import EditTask from "./EditTask";

const DeletingTask = () => (
  <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000] flex justify-center items-center">
    <div className="w-[42.5vw] h-[30vh] bg-white flex flex-col gap-[2vh] pt-[3vh] px-[2vw] rounded-md">
      <div className="flex flex-col items-center gap-4 pt-6">
        <FiLoader className="size-6 text-red-500 animate-spin" />
        <h3 className="text-red-400 text-xl font-bold">Deleting your task</h3>
      </div>
    </div>
  </div>
);

const ModalDelete = ({ setModalDelete, getAllTask, taskId }) => {
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  async function deleteTask() {
    try {
      setLoading(true);
      await axios.delete(
        "https://promanagerbakend.onrender.com/api/task/deleteTask",
        {
          data: { taskId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getAllTask();
      setModalDelete(false);
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <DeletingTask />;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000] flex justify-center items-center">
      <div className="w-[30vw] h-[20vh] bg-white flex flex-col gap-[2vh] pt-[3vh] px-[2vw] rounded-md">
        <p>Are you sure you want to delete</p>
        <div className="flex gap-2">
          <button
            className="border-2 border-red-500 p-2 rounded-md"
            onClick={() => setModalDelete(false)}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded-md"
            onClick={deleteTask}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

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

const TaskCard = ({ item, getAllTask }) => {
  const [modalDelete, setModalDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editTaskModel, setEditTaskModel] = useState(false);
  const [checkedLen, setCheckedLen] = useState(0);
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const [drop, setDrop] = useState(false);

  async function changeStatus(taskValue, taskId) {
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:3000/api/task/changeStatus",
        {
          taskId,
          newStatus: taskValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getAllTask();
      toast.success("status changed successfully");
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const checkLen = () => {
    let len = 0;
    item.checklist.map((item) => {
      if (item.checked) len++;
    });
    setCheckedLen(len);
  };

  async function changeCheckListStatus(checklistId, checked) {
    try {
      await axios.put(
        "http://localhost:3000/api/task/checklistChange",
        {
          taskId: item._id,
          checklistItemIds: checklistId,
          checkedItem: checked,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getAllTask();
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    checkLen();
  }, [item]);

  function getFirst2word(str) {
    return str.split("@")[0].slice(0, 2).toUpperCase();
  }

  {
    /* For changing the date format */
  }
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

  {
    /* Share the task */
  }
  const shareTask = (taskId) => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const link = `${protocol}//${host}/taskshare/${taskId}`;
    console.log(link);
    navigator.clipboard.writeText(link);
    toast.success("Link Copied on clipboard");
  };

  return loading ? (
    <>
      <ChangingTask />
    </>
  ) : (
    <>
      <div className="bg-white rounded-md p-2 shadow mb-4">
        <div className="flex justify-between p-1">
          <div className="flex gap-0.5 justify-start items-center text-sm font-light">
            <GoDotFill
              style={{
                color:
                  item.priority === "high"
                    ? "#FF2473"
                    : item.priority === "moderate"
                    ? "#18B0FF"
                    : item.priority === "low"
                    ? "#63C05B"
                    : "black",
              }}
            />
            <p>{item.priority} priority</p>
            {/*email != item.assigned && (
              <div>
                <p className="rounded-[50%] bg-[#FFEBEB] text-black text-[0.5rem] p-1 cursor-pointer">
                  {getFirst2word(item.assigned)}
                </p>
                <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                  {item.assigned.email}
                </span>
              </div>
            )*/}
            {email !== item.assigned && (
  <div className="relative group flex items-center justify-center w-6 h-6"> {/* Ensured dimensions */}
    <p className="rounded-full bg-[#FFEBEB] text-black text-[0.5rem] p-1 cursor-pointer flex items-center justify-center w-full h-full">
      {getFirst2word(item.assigned)}
    </p>
    <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
      {item.assigned}
    </span>
  </div>
)}
          </div>
          <div className="flex gap-1 font-light text-sm">
            <CiShare2
              className="cursor-pointer"
              onClick={() => shareTask(item._id)}
            />
            <CiEdit
              className=" cursor-pointer"
              onClick={() => setEditTaskModel(true)}
            />
            <MdDelete
              onClick={() => setModalDelete(true)}
              className="text-red-500 cursor-pointer"
            />
          </div>
        </div>
        <h1 className="font-semibold">{item.taskName}</h1>
        {/*checklist*/}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between">
            <h1>
              checkList ({checkedLen}/{item.checklist.length})
            </h1>
            {drop ? (
              <CiSquareChevDown
                className="cursor-pointer"
                onClick={() => setDrop(false)}
              />
            ) : (
              <CiSquareChevUp
                className="cursor-pointer"
                onClick={() => setDrop(true)}
              />
            )}
          </div>
          {drop && (
            <div className="flex flex-col gap-1 h-40 overflow-y-auto">
              {item.checklist.map((x) => (
                <div className="p-1 border-[#E2E2E2] border-2 flex items-center rounded-md gap-2">
                  <input
                    type="checkbox"
                    checked={x.checked}
                    onChange={(e) =>
                      changeCheckListStatus(x._id, e.target.checked)
                    }
                  />
                  <p>{x.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Bottom container */}
        <div className="flex justify-between mt-2">
          <div
            className="bg-red-500 text-white text-[0.4rem] rounded-md p-1"
            style={{
              background: item.status === "done" ? "#63C05B" : "",
              color: item.status === "done" ? "white" : "",
            }}
          >
            {formatDateToMonthDay(item.duedate)}
          </div>
          <div className="flex gap-1">
            {item.status !== "todo" && (
              <button
                className="bg-[#EEECEC] text-[#767575] text-[0.4rem] rounded-md p-1 cursor-pointer"
                onClick={() => changeStatus("todo", item._id)}
              >
                todo
              </button>
            )}
            {item.status !== "inprogress" && (
              <button
                className="bg-[#EEECEC] text-[#767575] text-[0.4rem] rounded-md p-1 cursor-pointer"
                onClick={() => changeStatus("inprogress", item._id)}
              >
                In progress
              </button>
            )}
            {item.status !== "backlog" && (
              <button
                className="bg-[#EEECEC] text-[#767575] text-[0.4rem] rounded-md p-1 cursor-pointer"
                onClick={() => changeStatus("backlog", item._id)}
              >
                backlog
              </button>
            )}
            {item.status !== "done" && (
              <button
                className="bg-[#EEECEC] text-[#767575] text-[0.4rem] rounded-md p-1 cursor-pointer"
                onClick={() => changeStatus("done", item._id)}
              >
                done
              </button>
            )}
          </div>
        </div>
      </div>
      {modalDelete && (
        <ModalDelete
          setModalDelete={setModalDelete}
          getAllTask={getAllTask}
          taskId={item._id}
        />
      )}
      {editTaskModel && (
        <EditTask
          setEditTaskModel={setEditTaskModel}
          editableTask={item}
          getAllTask={getAllTask}
        />
      )}
    </>
  );
};

export default TaskCard;
