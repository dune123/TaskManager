import axios from "axios";
import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { useParams } from "react-router-dom";

const TaskShare = () => {
  const [task, setTask] = useState({});
  const { taskId } = useParams();

  async function getTask() {
    try {
      const res = await axios.get(
        `https://promanagerbakend-production.up.railway.app/api/task/getTaskById/${taskId}`
      );
      console.log(res);
      if (res.status === 201) {
        setTask(res.data.task);
      } else {
        console.log(res.data);
        toast.error(res.data.message || "Failed to fetch task");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
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

  useEffect(() => {
    getTask();
  }, []);
  
  return (
    <div className="flex flex-col items-center">
      {/* top container */}
      <div className="flex p-4 justify-start">
        <h1 className="flex items-start text-2xl font-bold">proManager</h1>
      </div>

      {/* bottom container */}
      <div className="w-[50vw] h-[60vh] flex flex-col gap-2 border-[1px] border-[#EDF5FE] p-4">
        <div className="flex gap-2 p-2 items-center">
          <GoDotFill
            style={{
              color:
                task.priority === "high"
                  ? "#FF2473"
                  : task.priority === "moderate"
                  ? "#18B0FF"
                  : task.priority === "low"
                  ? "#63C05B"
                  : "black",
            }}
          />{" "}
          {task.priority} priority
        </div>
        <div className="p-2">
          <h1 className="font-semibold text-3xl">{task.taskName}</h1>
        </div>
        <div className="flex flex-col gap-4">
          <p>
            Checklist (
            {task?.checklist?.filter((item) => item.checked == true).length ||
              0}
            /{task?.checklist?.length || 0})
          </p>

          <div className="flex flex-col overflow-y-auto h-[40vh]">
            {Array.isArray(task.checklist) &&
              task.checklist.map((x) => (
                <div
                  key={x._id}
                  className="m-2 p-1 border-[#E2E2E2] border-2 flex items-center rounded-md gap-2"
                >
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
        </div>
        <div className="flex gap-2 items-center">
            <p className="text-semibold">due Date</p>
            <div className="bg-red-500 text-white p-1 rounded-md">{formatDateToMonthDay(task.duedate)}</div>
        </div>
      </div>
    </div>
  );
};

export default TaskShare;
