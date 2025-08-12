import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login"
import Signup from './signup';
import Forgotpassword from './forgotpassword';
import Index from "./index";

function App() {
  return (
    <Router>
      <Routes>
        {/* หน้า Login */}
        <Route path="/" element={<Login />} />

        {/* หน้า Index */}
        <Route path="/index" element={<Index />} />

        {/* หน้า Forgot password */}
        <Route path="/forgotpassword" element={<Forgotpassword />} />

        {/* หน้า Sign up */}
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  )
}

export default App