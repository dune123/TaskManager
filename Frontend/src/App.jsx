import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <BrowserRouter>
    <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App