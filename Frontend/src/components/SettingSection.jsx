import React, { useState } from 'react'
import { CiUser } from "react-icons/ci";
import { AiOutlineMail } from "react-icons/ai";
import { CiLock } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SettingSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const username = window.localStorage.getItem("Username")
  const email = window.localStorage.getItem("email")
  const token = window.localStorage.getItem("token")
  const [formValues, setFormValues] = useState({
    oldPassword: "",
    newPassword: ""
  })

  const navigate = useNavigate()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword)
  }

  const updatePassword = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/user/changePassword", formValues, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
        toast.success(res.data.message);
        navigate("/")
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
  }


  return (
    <div className="w-screen h-screen px-[3vw] py-[4vh]">
      <h3 className="text-[1.3rem] font-semibold mb-[2vh]">Settings</h3>

      <div className="">
        <form className="flex flex-col gap-[2vh] w-[25vw] mb-[3vh]">
          {/* Username */}
          <div className="relative flex flex-col">
            <div className="relative flex items-center">
              <CiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
              <input
                placeholder="Name"
                className="w-full h-[7vh] pl-10 pr-10 border border-gray-300 rounded-lg"
                value={username}
                readOnly
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative flex flex-col">
            <div className="relative flex items-center">
              <AiOutlineMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
              <input
                placeholder="Email"
                className="w-full h-[7vh] pl-10 pr-10 border border-gray-300 rounded-lg"
                value={email}
                readOnly
              />
            </div>
          </div>

          {/* Old Password */}
          <div className="relative flex flex-col">
            <div className="relative flex items-center">
              <CiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Old Password"
                className="w-full h-[7vh] pl-10 pr-10 border border-gray-300 rounded-lg"
                value={formValues.oldPassword}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    oldPassword: e.target.value
                  }))
                }
              />
              {showPassword ? (
                <IoEyeOutline
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-700"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <IoEyeOffOutline
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-700"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
          </div>

          {/* New Password */}
          <div className="relative flex flex-col">
            <div className="relative flex items-center">
              <CiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                className="w-full h-[7vh] pl-10 pr-10 border border-gray-300 rounded-lg"
                value={formValues.newPassword}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    newPassword: e.target.value
                  }))
                }
              />
              {showNewPassword ? (
                <IoEyeOutline
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-700"
                  onClick={toggleConfirmPasswordVisibility}
                />
              ) : (
                <IoEyeOffOutline
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-700"
                  onClick={toggleConfirmPasswordVisibility}
                />
              )}
            </div>
          </div>
        </form>

        <button
          onClick={updatePassword}
          className="w-[25vw] h-[7vh] rounded-[1.4rem] bg-[#17A2B8] text-white font-medium hover:bg-[#138a9e] transition"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default SettingSection;
