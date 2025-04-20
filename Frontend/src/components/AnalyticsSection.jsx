import React, { useEffect, useState } from 'react';
import { GoDotFill } from "react-icons/go";
import axios from 'axios';
import { toast } from "react-toastify";

const AnalyticsSection = () => {
  const [status, setStatus] = useState([]);
  const [priority, setPriority] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const token = window.localStorage.getItem("token");

  const getStatusandPriority = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/task/getanalytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res)
      if (res.status === 200) {
        setStatus(res.data.resultforstatus);
        setPriority(res.data.resultforpriority);
        setDueDate(res.data.numberofDuedate);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getStatusandPriority();
  }, []);


  return (
    <div className='w-full h-[100vh]'>
    <div className="pl-[4vw] pt-[3.5vh] flex flex-col gap-[3vh] font-sans">
      <h2 className="text-2xl font-semibold">Analytics</h2>

      <div className="flex gap-[3vw]">
        {/* Left Container */}
        <div className="pl-[3vw] pt-[3vh] w-[33vw] h-[35vh] bg-[#F9FCFF] flex flex-col gap-[5vh] rounded-2xl">
          <div className="flex justify-between w-[30vw]">
            <div className="flex items-center gap-[1vw]">
              <GoDotFill className="text-[#90C4CC]" />
              <p>Backlog Task</p>
            </div>
            <p>{status.backlog}</p>
          </div>

          <div className="flex justify-between w-[30vw]">
            <div className="flex items-center gap-[1vw]">
              <GoDotFill className="text-[#90C4CC]" />
              <p>Completed Tasks</p>
            </div>
            <p>{status.done}</p>
          </div>

          <div className="flex justify-between w-[30vw]">
            <div className="flex items-center gap-[1vw]">
              <GoDotFill className="text-[#90C4CC]" />
              <p>In Progress Tasks</p>
            </div>
            <p>{status.inprogress || 0}</p>
          </div>

          <div className="flex justify-between w-[30vw]">
            <div className="flex items-center gap-[1vw]">
              <GoDotFill className="text-[#90C4CC]" />
              <p>To-do Tasks</p>
            </div>
            <p>{status.todo}</p>
          </div>
        </div>

        {/* Right Container */}
        <div className="pl-[4vw] pt-[4vh] w-[33vw] h-[35vh] bg-[#F9FCFF] flex flex-col gap-[5vh] rounded-2xl">
          <div className="flex justify-between w-[30vw]">
            <div className="flex items-center gap-[1vw]">
              <GoDotFill className="text-[#90C4CC]" />
              <p>Low Priority</p>
            </div>
            <p>{priority.low}</p>
          </div>

          <div className="flex justify-between w-[30vw]">
            <div className="flex items-center gap-[1vw]">
              <GoDotFill className="text-[#90C4CC]" />
              <p>Moderate Priority</p>
            </div>
            <p>{priority.moderate}</p>
          </div>

          <div className="flex justify-between w-[30vw]">
            <div className="flex items-center gap-[1vw]">
              <GoDotFill className="text-[#90C4CC]" />
              <p>High Priority</p>
            </div>
            <p>{priority.high}</p>
          </div>

          <div className="flex justify-between w-[30vw]">
            <div className="flex items-center gap-[1vw]">
              <GoDotFill className="text-[#90C4CC]" />
              <p>Due Date Tasks</p>
            </div>
            <p>{dueDate}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AnalyticsSection;
