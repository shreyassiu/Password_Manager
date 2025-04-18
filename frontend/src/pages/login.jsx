import React, { use, useState,useRef } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleSuccess, handleError } from '../utils'
import 'react-toastify/ReactToastify.css'
import Navbar from '../components/Navbar'
const url = import.meta.env.VITE_API_LOGIN_URL



const login = () => {

  const [loginInfo, setloginInfo] = useState({
    email: "",
    password: ""
  })
  const passRef = useRef()
  const ref = useRef()
  const [isLoading, setisLoading] = useState(false)
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    const copyloginInfo = { ...loginInfo }
    copyloginInfo[name] = value;
    setloginInfo(copyloginInfo)
  }
  const showPassword = () => {
    passRef.current.type = passRef.current.type === "password" ? "text" : "password";
    if (ref.current.src.includes("/icons/hide.png"))
      ref.current.src = "/icons/eye.png"
    else
      ref.current.src = "/icons/hide.png"
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Please fill all the fields")
    }
    setisLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginInfo)
      })
      const data = await response.json()
      const { success, message, jwtToken, email ,error } = data;
      setisLoading(false);
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
          <div className='flex gap-1 flex-col relative'>
            <label htmlFor='password'>Password</label>
            <input
              onChange={handleChange}
              type="password"
              ref={passRef}
              placeholder='Enter your password'
              name='password'
              className='p-1 rounded-md placeholder:italic'
              value={loginInfo.password}
            />
            <span
                  onClick={showPassword}
                  className="text-black absolute right-2 top-8 cursor-pointer"
                >
                  <img
                    ref={ref}
                    className="p-1"
                    width={32} 
                    src="icons/eye.png"
                    alt=""
                  />
                </span>
          </div>
          <div className='flex flex-col items-center gap-2'>
            <button type='submit' className='bg-slate-700 text-white flex justify-center items-center font-serif px-2 py-1 rounded-md hover:bg-slate-600 transition-all duration-200 ease-in-out w-[50%]'>
              {!isLoading && "Login"}
              {isLoading && <svg className="animate-spin h-5 w-5 mr-3 border-b-2 border-white rounded-full" viewBox="0 0 24 24"></svg>}
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
