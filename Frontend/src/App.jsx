import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import { ToastContainer } from 'react-toastify'
import TaskShare from './pages/TaskShare'

const App = () => {
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/taskShare/:taskId" element={<TaskShare/>} />
      </Routes>
    </>
  )
}

export default App