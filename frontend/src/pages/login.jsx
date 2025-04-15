import React, { use, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleSuccess, handleError } from '../utils'
import 'react-toastify/ReactToastify.css'
import Navbar from '../components/Navbar'




const login = () => {

  const [loginInfo, setloginInfo] = useState({
    email: "",
    password: ""
  })
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    const copyloginInfo = { ...loginInfo }
    copyloginInfo[name] = value;
    setloginInfo(copyloginInfo)
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Please fill all the fields")
    }
    try {
      const url = "https://password-manager-vuar.onrender.com/auth/login"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginInfo)
      })
      // console.log(response);
      const data = await response.json()
      console.log(data);
      console.log(data.message);
      const { success, message, jwtToken, email ,error } = data;
      if (success) {

        handleSuccess("Login successful")
        localStorage.setItem("Token", jwtToken)
        localStorage.setItem("loggedInUser", email)
        setTimeout(() => {
          navigate("/home")
        }, 2000)
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details)
      } else if (!success) {
        handleError(message)
      }

    } catch (error) {
      handleError(error);
    }
  }
  const loggingIn = ()=>{
    navigate("/login")
  }
  const signingUp = ()=>{
    navigate("/signup")
  }
  return (
    <div>
      <Navbar login = {loggingIn} signup = {signingUp}/>
    <div className="container w-full h-80vh flex flex-col justify-center items-center p-20">
      <div className='p-10 rounded-md flex flex-col gap-4 shadow-2xl'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-mono'>Login</h1>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-5" action="">
          <div className='flex gap-1 flex-col'>
            <label htmlFor='email'>Email</label>
            <input
              onChange={handleChange}
              type="email"
              placeholder='Enter your email'
              name='email'
              className='p-1 rounded-md placeholder:italic'
              value={loginInfo.email}
              autoFocus
            />
          </div>
          <div className='flex gap-1 flex-col'>
            <label htmlFor='password'>Password</label>
            <input
              onChange={handleChange}
              type="password"
              placeholder='Enter your password'
              name='password'
              className='p-1 rounded-md placeholder:italic'
              value={loginInfo.password}
            />
          </div>
          <div className='flex flex-col items-center gap-2'>
            <button type='submit' className='bg-slate-700 text-white font-serif px-2 py-1 rounded-md hover:bg-slate-600 transition-all duration-200 ease-in-out w-[50%]'>
              Login
            </button>
            <div>Don't have an account? <Link to='/signup' className='text-purple-900 underline'>Sign Up</Link></div>
          </div>
        </form>
      </div>
      <ToastContainer position='top-center' autoClose={2000} theme='dark' />
    </div>
    </div>
  )
}

export default login
